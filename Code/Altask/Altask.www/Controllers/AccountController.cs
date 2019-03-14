using Altask.Data;
using Altask.Data.Model;
using Altask.www.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Altask.www.Controllers {
    public class AccountController : BaseController {
        /// <summary>
        /// Constructor
        /// </summary>
        public AccountController() : base() {

        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="signInManager"></param>
        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {

        }

        private IAuthenticationManager AuthenticationManager {
            get {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [JsonNetFilter]
        public async Task<ActionResult> ChangePassword(ChangePasswordModel model) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var user = await UserManager.FindByNameAsync(model.UserName);

            if (user == null) {
                return BadRequest(ErrorDescriber.UserDoesNotExist(model.UserName));
            }

            var token = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
            var result = await UserManager.ResetPasswordAsync(user.Id, token, model.Password);

            if (result.Succeeded) {
                await UserManager.AddUserLogAsync(user, new UserLog() { Type = "ChangePassword" });
                return Ok(new { user = user.ToDto() });
            }

            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error);
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        [JsonNetFilter]
        public async Task<ActionResult> Login(LoginModel model) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByNameAsync(model.UserName);

            if (user == null) {
                return BadRequest(ErrorDescriber.InvalidUserName(model.UserName));
            }

            var results = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            switch (results) {
                case SignInStatus.Success:
                    await UserManager.AddUserLogAsync(user, new UserLog() { Type = "Login" });

                    var rolesDto = new List<Altask.Data.Dto.UserRole>();

                    foreach (var role in user.Roles) {
                        rolesDto.Add(role.ToDto());
                    }

                    return Ok(new { clientId = Guid.NewGuid(), user = user.ToDto(), roles = rolesDto });
                case SignInStatus.LockedOut:
                    return BadRequest(ErrorDescriber.UserLockedOut());
                case SignInStatus.RequiresVerification:
                    return BadRequest(ErrorDescriber.VerificationRequired());
                case SignInStatus.Failure:
                    return BadRequest(ErrorDescriber.InvalidCredentials());
                default:
                    return BadRequest(ErrorDescriber.InvalidLoginAttempt());
            }
        }

        [AllowAnonymous]
        public ActionResult Login(string returnUrl) {
            Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            Response.SuppressFormsAuthenticationRedirect = true;
            return Json(new { returnUrl = returnUrl }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [JsonNetFilter]
        public async Task<ActionResult> Logout(int userId) {
            var user = await UserManager.FindByIdAsync(userId);

            if (user != null) {
                await UserManager.AddUserLogAsync(user, new UserLog() { Type = "Logout" });
            }

            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [JsonNetFilter]
        public async Task<ActionResult> Register(RegisterModel model) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var user = new Altask.Data.Model.User {
                Active = true,
                UserName = model.UserName,
                FullName = model.FullName,
                Metadata = string.Empty,
            };

            var result = await UserManager.CreateAsync(user, model.Password);

            if (result.Succeeded) {
                if (model.Roles != null) {
                    foreach (var role in model.Roles) {
                        await UserManager.AddToRoleAsync(user.Id, role);
                    }
                }

                await UserManager.AddUserLogAsync(user, new UserLog() { Type = "Register" });
                return Ok(new { user = user.ToDto() });
            }

            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error);
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [JsonNetFilter]
        public virtual async Task<ActionResult> TestEmail(string email) {
            ThrowIfDisposed();

            try {
                var settings = Context.Settings.Where(s => s.Area == "System" && s.Classification == "Email").ToList();
                var emailService = new EmailService(settings.Single(s => s.Name == "SmtpAddress").Value,
                    int.Parse(settings.Single(s => s.Name == "SmtpPort").Value),
                    settings.Single(s => s.Name == "UserName").Value,
                    settings.Single(s => s.Name == "Password").Value);
                var result = await emailService.SendAsync("noreply@altask.com", email, Settings.AlertEmailSubject, "This is a test to verify this email address.");

                if (result.Succeeded) {
                    return Ok();
                }
                else {
                    return BadRequest(result);
                }
            }
            catch (Exception ex) {
                return BadRequest(ErrorDescriber.DefaultError(string.Format("Sending email failed: {0}", ex.Message)));
            }
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {

            }

            base.Dispose(disposing);
        }
    }
}