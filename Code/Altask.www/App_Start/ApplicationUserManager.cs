using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Security.Claims;
using Altask.Data.Model;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System.Linq;

namespace Altask.www {
	public class ApplicationUserManager : UserManager {
        private Dictionary<Guid, string> clients = new Dictionary<Guid, string>();

        public ApplicationUserManager(UserStore store)
			: base(store) {
		}

		public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context) {
            var dbContext = context.Get<ApplicationDbContext>();
            var manager = new ApplicationUserManager(new UserStore(dbContext));
			// FormBuilderConfigure validation logic for usernames
			manager.UserValidator = new UserValidator<User, int>(manager) {
				AllowOnlyAlphanumericUserNames = false,
				RequireUniqueEmail = false
			};

			// FormBuilderConfigure validation logic for passwords
			manager.PasswordValidator = new PasswordValidator {
				RequiredLength = 6,
				RequireNonLetterOrDigit = true,
				RequireDigit = true,
				RequireLowercase = true,
				RequireUppercase = true,
			};

			// FormBuilderConfigure user lockout defaults
			manager.UserLockoutEnabledByDefault = false;

            var settings = dbContext.Settings.Where(s => s.Area == "System" && s.Classification == "Email").ToList();
            manager.EmailService = new EmailService(settings.Single(s => s.Name == "SmtpAddress").Value,
                int.Parse(settings.Single(s => s.Name == "SmtpPort").Value),
                settings.Single(s => s.Name == "UserName").Value,
                settings.Single(s => s.Name == "Password").Value);

            //manager.SmsService = new SmsService();

            var dataProtectionProvider = options.DataProtectionProvider;
			if (dataProtectionProvider != null) {
				manager.UserTokenProvider =
					new DataProtectorTokenProvider<User, int>(dataProtectionProvider.Create("ASP.NET Identity"));
			}
			return manager;
		}
	}
}