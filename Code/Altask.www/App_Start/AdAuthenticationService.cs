using System;
using System.Diagnostics;
using System.DirectoryServices.AccountManagement;
using System.Security.Claims;
using Altask.www.Properties;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace Altask.www {
	public class AdAuthenticationService {
		private readonly IAuthenticationManager authenticationManager;

		public AdAuthenticationService(IAuthenticationManager authenticationManager) {
			this.authenticationManager = authenticationManager;
		}


		/// <summary>
		/// Check if username and password matches existing account in AD. 
		/// </summary>
		/// <param name="username"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		public SignInStatus SignIn(String username, String password) {
#if DEBUG
			// authenticates against your local machine - for development time
			ContextType authenticationType = ContextType.Machine;
#else
            // authenticates against your Domain AD
            ContextType authenticationType = ContextType.Domain;
#endif
			PrincipalContext principalContext = new PrincipalContext(authenticationType);
			bool isAuthenticated = false;
			UserPrincipal userPrincipal = null;
			try {
				isAuthenticated = principalContext.ValidateCredentials(username, password, ContextOptions.Negotiate);
				if (isAuthenticated) {
					userPrincipal = UserPrincipal.FindByIdentity(principalContext, username);
				}
			} catch (Exception ex) {
				EventLog.WriteEntry(Settings.Default.EventLogSource, ex.Message, EventLogEntryType.FailureAudit);
				isAuthenticated = false;
				userPrincipal = null;
			}

			if (!isAuthenticated || userPrincipal == null) {
				return SignInStatus.Failure;
			}

			if (userPrincipal.IsAccountLockedOut()) {
				// here can be a security related discussion weather it is worth 
				// revealing this information
				return SignInStatus.LockedOut;
			}

			if (userPrincipal.Enabled.HasValue && userPrincipal.Enabled.Value == false) {
				// here can be a security related discussion weather it is worth 
				// revealing this information
				return SignInStatus.LockedOut;
			}

			var identity = CreateIdentity(userPrincipal);

			authenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
			authenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = false }, identity);
			return SignInStatus.Success;
		}

		private ClaimsIdentity CreateIdentity(UserPrincipal userPrincipal) {
			var identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie, ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
			identity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "Active Directory"));
			identity.AddClaim(new Claim(ClaimTypes.Name, userPrincipal.SamAccountName));
			identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userPrincipal.SamAccountName));
			if (!String.IsNullOrEmpty(userPrincipal.EmailAddress)) {
				identity.AddClaim(new Claim(ClaimTypes.Email, userPrincipal.EmailAddress));
			}

			var groups = userPrincipal.GetAuthorizationGroups();

			foreach (var group in groups) {
				identity.AddClaim(new Claim(ClaimTypes.Role, group.Name));
			}

			return identity;
		}
	}
}