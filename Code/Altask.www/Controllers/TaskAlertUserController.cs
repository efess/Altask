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
    public partial class TaskAlertUserController : BaseController<Altask.Data.Model.TaskAlertUser, Altask.Data.Dto.TaskAlertUser>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public TaskAlertUserController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public TaskAlertUserController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.TaskAlertUser"/>.
    	/// </summary>
    	/// <param name="taskAlertUser"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.TaskAlertUser taskAlertUser) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newTaskAlertUser = new Altask.Data.Model.TaskAlertUser().FromDto(taskAlertUser);
    		Context.TaskAlertUsers.Add(newTaskAlertUser);
    		BeforeCreate(newTaskAlertUser, taskAlertUser);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newTaskAlertUser).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newTaskAlertUser);
    			return Ok(new { taskAlertUser = newTaskAlertUser.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.TaskAlertUser"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.TaskAlertUser"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var taskAlertUser = await Context.TaskAlertUsers.FindAsync(id);
    		return Ok(new { taskAlertUser = taskAlertUser.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.TaskAlertUser"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.TaskAlertUserListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(TaskAlertUserListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new TaskAlertUserListOptions();
    		}
    
    		var dtoTaskAlertUsers = new List<Altask.Data.Dto.TaskAlertUser>();
    		var taskAlertUser = await Context.TaskAlertUsers.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.User)
    			.ToListAsync();
    
    		foreach(var item in taskAlertUser) {
    			dtoTaskAlertUsers.Add(item.ToDto());
    		}
    
    		return Ok(new { taskAlertUsers = dtoTaskAlertUsers }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.TaskAlertUser"/>.
    	/// </summary>
    	/// <param name="taskAlertUser"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.TaskAlertUser taskAlertUser) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var taskAlertUserEntity = await Context.TaskAlertUsers.FindAsync(taskAlertUser.Id);
    
    		if (taskAlertUserEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("TaskAlertUser"));
    		}
    
    		taskAlertUserEntity.FromDto(taskAlertUser);
    		Context.Entry(taskAlertUserEntity).State = EntityState.Modified;
    		BeforeUpdate(taskAlertUserEntity, taskAlertUser);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(taskAlertUserEntity).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(taskAlertUserEntity);
    			return Ok(new { taskAlertUser = taskAlertUserEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
