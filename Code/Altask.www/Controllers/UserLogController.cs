//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
namespace Altask.www.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using System.Xml;
    using Altask.www.Models;
    using Data.Model;
    
    [Authorize]
    public partial class UserLogController : BaseController<Altask.Data.Model.UserLog, Altask.Data.Dto.UserLog>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public UserLogController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public UserLogController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.UserLog"/>.
    	/// </summary>
    	/// <param name="userLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.UserLog userLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newUserLog = new Altask.Data.Model.UserLog().FromDto(userLog);
    		Context.UserLogs.Add(newUserLog);
    		BeforeCreate(newUserLog, userLog);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newUserLog).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newUserLog);
    			return Ok(new { userLog = newUserLog.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.UserLog"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.UserLog"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var userLog = await Context.UserLogs.FindAsync(id);
    		return Ok(new { userLog = userLog.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.UserLog"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.UserLogListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(UserLogListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new UserLogListOptions();
    		}
    
    		var dtoUserLogs = new List<Altask.Data.Dto.UserLog>();
    		var userLog = await Context.UserLogs.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.User)
    			.ToListAsync();
    
    		foreach(var item in userLog) {
    			dtoUserLogs.Add(item.ToDto());
    		}
    
    		return Ok(new { userLogs = dtoUserLogs }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.UserLog"/>.
    	/// </summary>
    	/// <param name="userLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.UserLog userLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var userLogEntity = await Context.UserLogs.FindAsync(userLog.Id);
    
    		if (userLogEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("UserLog"));
    		}
    
    		userLogEntity.FromDto(userLog);
    		Context.Entry(userLogEntity).State = EntityState.Modified;
    		BeforeUpdate(userLogEntity, userLog);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(userLogEntity).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(userLogEntity);
    			return Ok(new { userLog = userLogEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
