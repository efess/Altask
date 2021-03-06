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
    public partial class TaskAlertLogController : BaseController<Altask.Data.Model.TaskAlertLog, Altask.Data.Dto.TaskAlertLog>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public TaskAlertLogController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public TaskAlertLogController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.TaskAlertLog"/>.
    	/// </summary>
    	/// <param name="taskAlertLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.TaskAlertLog taskAlertLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newTaskAlertLog = new Altask.Data.Model.TaskAlertLog().FromDto(taskAlertLog);
    		Context.TaskAlertLogs.Add(newTaskAlertLog);
    		BeforeCreate(newTaskAlertLog, taskAlertLog);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newTaskAlertLog).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newTaskAlertLog);
    			return Ok(new { taskAlertLog = newTaskAlertLog.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.TaskAlertLog"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.TaskAlertLog"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var taskAlertLog = await Context.TaskAlertLogs.FindAsync(id);
    		return Ok(new { taskAlertLog = taskAlertLog.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.TaskAlertLog"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.TaskAlertLogListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(TaskAlertLogListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new TaskAlertLogListOptions();
    		}
    
    		var dtoTaskAlertLogs = new List<Altask.Data.Dto.TaskAlertLog>();
    		var taskAlertLog = await Context.TaskAlertLogs.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.User)
    			.ToListAsync();
    
    		foreach(var item in taskAlertLog) {
    			dtoTaskAlertLogs.Add(item.ToDto());
    		}
    
    		return Ok(new { taskAlertLogs = dtoTaskAlertLogs }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.TaskAlertLog"/>.
    	/// </summary>
    	/// <param name="taskAlertLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.TaskAlertLog taskAlertLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var taskAlertLogEntity = await Context.TaskAlertLogs.FindAsync(taskAlertLog.Id);
    
    		if (taskAlertLogEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("TaskAlertLog"));
    		}
    
    		taskAlertLogEntity.FromDto(taskAlertLog);
    		Context.Entry(taskAlertLogEntity).State = EntityState.Modified;
    		BeforeUpdate(taskAlertLogEntity, taskAlertLog);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(taskAlertLogEntity).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(taskAlertLogEntity);
    			return Ok(new { taskAlertLog = taskAlertLogEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
