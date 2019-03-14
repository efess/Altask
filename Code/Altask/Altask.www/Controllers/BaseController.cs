using System;
using System.Diagnostics;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Altask.Data;
using Altask.Data.Model;
using Altask.www.Models;
using Altask.www.Properties;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity.Owin;


namespace Altask.www.Controllers {
	public class JsonNetFilterAttribute : ActionFilterAttribute {
		public override void OnActionExecuted(ActionExecutedContext filterContext) {
			if (filterContext.Result is JsonResult == false) {
				return;
			}

			filterContext.Result = new JsonNetResult((JsonResult)filterContext.Result);
		}

		private class JsonNetResult : JsonResult {
			public JsonNetResult(JsonResult jsonResult) {
				this.ContentEncoding = jsonResult.ContentEncoding;
				this.ContentType = jsonResult.ContentType;
				this.Data = jsonResult.Data;
				this.JsonRequestBehavior = jsonResult.JsonRequestBehavior;
				this.MaxJsonLength = jsonResult.MaxJsonLength;
				this.RecursionLimit = jsonResult.RecursionLimit;
			}

			public override void ExecuteResult(ControllerContext context) {
				if (context == null) {
					throw new ArgumentNullException("context");
				}

				var isMethodGet = string.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase);

				if (this.JsonRequestBehavior == JsonRequestBehavior.DenyGet && isMethodGet) {
					throw new InvalidOperationException("GET not allowed! Change JsonRequestBehavior to AllowGet.");
				}

				var response = context.HttpContext.Response;

				response.ContentType = string.IsNullOrEmpty(this.ContentType) ? "application/json" : this.ContentType;

				if (this.ContentEncoding != null) {
					response.ContentEncoding = this.ContentEncoding;
				}

				if (this.Data != null) {
					response.Write(JsonConvert.SerializeObject(this.Data));
				}
			}
		}
	}

	public class BaseController<TModel, TDto> : BaseController {
		public BaseController() : base() {

		}
		public BaseController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {

		}

        internal virtual async System.Threading.Tasks.Task<EntityResult> AfterCreateAsync(TModel entity, bool notifyAll = false) {
			return await System.Threading.Tasks.Task.FromResult(EntityResult.Succeded(0));
		}

		internal virtual async System.Threading.Tasks.Task<EntityResult> AfterUpdateAsync(TModel entity, bool notifyAll = false) {
			return await System.Threading.Tasks.Task.FromResult(EntityResult.Succeded(0));
		}

		internal virtual void BeforeCreate(TModel entity, TDto dto) {
		}

		internal virtual void BeforeUpdate(TModel entity, TDto dto) {
		}
	}

	public class BaseController : Controller {
		private ApplicationSignInManager _signInManager;
		private ApplicationUserManager _userManager;
		private AltaskDbContext _context;
		private bool _disposed;
		private ErrorDescriber _errorDescriber;

		public ApplicationSignInManager SignInManager
		{
			get
			{
				return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
			}
			private set
			{
				_signInManager = value;
			}
		}

		public ApplicationUserManager UserManager
		{
			get
			{
				return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
			}
			private set
			{
				_userManager = value;
			}
		}

        protected Guid? ClientId {
            get {
                if (!string.IsNullOrEmpty(HttpContext.Request.Headers["X-Altask-Client-Id"])) {
                    return Guid.Parse(HttpContext.Request.Headers["X-Altask-Client-Id"]);
                }

                return Guid.Empty;
            }
        }

		protected AltaskDbContext Context
		{
			get
			{
                if (_context == null) {
                    var user = HttpContext.User.Identity.Name;

                    if (!string.IsNullOrEmpty(HttpContext.Request.Headers["X-Altask-User-Name"])) {
                        user = HttpContext.Request.Headers["X-Altask-User-Name"];
                    }

					_context = new AltaskDbContext(user, "Name = Default");
				}

				return _context;
			}
		}

		protected ErrorDescriber ErrorDescriber
		{
			get
			{
				if (_errorDescriber == null) {
					_errorDescriber = new ErrorDescriber();
				}

				return _errorDescriber;
			}
		}

		public BaseController() : base() { }

		public BaseController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) {
			UserManager = userManager;
			SignInManager = signInManager;
		}

		protected JsonResult BadRequest(ModelStateDictionary modelStateDictionary) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errors = new ErrorCollection();

			foreach (var key in modelStateDictionary.Keys) {
				ModelState modelState = null;

				if (modelStateDictionary.TryGetValue(key, out modelState)) {
					foreach (var error in modelState.Errors) {
						errors.Add(new Error() {
							Code = key,
							Description = error.ErrorMessage
						});
					}
				}
			}

			EventLog.WriteEntry(Settings.EventLogSource, errors.ToString(), EventLogEntryType.Error);
			return Json(new { errors = errors });
		}

		protected JsonResult BadRequest(ModelState modelState) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errors = new ErrorCollection();

			foreach (var error in modelState.Errors) {
				errors.Add(new Error {
					Code = "Error",
					Description = error.ErrorMessage
				});
			}

			EventLog.WriteEntry(Settings.EventLogSource, errors.ToString(), EventLogEntryType.Error);
			return Json(new { errors = errors });
		}
		protected JsonResult BadRequest(params Error[] errors) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errorCollection = new ErrorCollection();
			errorCollection.AddRange(errors);
			EventLog.WriteEntry(Settings.EventLogSource, errorCollection.ToString(), EventLogEntryType.Error);
			return Json(new { errors = errors });
		}

		protected JsonResult BadRequest(JsonRequestBehavior behavior, params Error[] errors) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errorCollection = new ErrorCollection();
			errorCollection.AddRange(errors);
			EventLog.WriteEntry(Settings.EventLogSource, errorCollection.ToString(), EventLogEntryType.Error);
			return Json(new { errors = errors }, behavior);
		}

		protected JsonResult BadRequest(EntityResult result) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errorCollection = new ErrorCollection();
			errorCollection.AddRange(result.Errors);
			EventLog.WriteEntry(Settings.EventLogSource, errorCollection.ToString(), EventLogEntryType.Error);
			return Json(new { errors = result.Errors });
		}

		protected JsonResult BadRequest(JsonRequestBehavior behavior, EntityResult result) {
			Response.StatusCode = (int)HttpStatusCode.BadRequest;
			var errorCollection = new ErrorCollection();
			errorCollection.AddRange(result.Errors);
			EventLog.WriteEntry(Settings.EventLogSource, errorCollection.ToString(), EventLogEntryType.Error);
			return Json(new { errors = result.Errors }, behavior);
		}

		protected JsonResult Ok(JsonRequestBehavior behavior = JsonRequestBehavior.DenyGet) {
			Response.StatusCode = (int)HttpStatusCode.OK;
			return Json(new { }, behavior);
		}

		protected JsonResult Ok(object data, JsonRequestBehavior behavior = JsonRequestBehavior.DenyGet) {
			Response.StatusCode = (int)HttpStatusCode.OK;
			return Json(data, behavior);
		}

		internal Settings Settings
		{
			get
			{
				return Settings.Default;
			}
		}

		protected override void Dispose(bool disposing) {
			if (_disposed) {
				return;
			}

			if (disposing) {
				if (_context != null) {
					_context.Dispose();
				}

				if (_userManager != null) {
					_userManager.Dispose();
				}

				if (_signInManager != null) {
					_signInManager.Dispose();
				}
			}

			base.Dispose(disposing);
			_disposed = true;
			_context = null;
			_userManager = null;
			_signInManager = null;
		}

		protected void ThrowIfDisposed() {
			if (_disposed) {
				throw new ObjectDisposedException(GetType().Name);
			}
		}
	}
}