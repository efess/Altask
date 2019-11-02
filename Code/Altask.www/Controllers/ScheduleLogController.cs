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
    public partial class ScheduleLogController : BaseController<Altask.Data.Model.ScheduleLog, Altask.Data.Dto.ScheduleLog>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public ScheduleLogController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public ScheduleLogController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.ScheduleLog"/>.
    	/// </summary>
    	/// <param name="scheduleLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.ScheduleLog scheduleLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newScheduleLog = new Altask.Data.Model.ScheduleLog().FromDto(scheduleLog);
    		Context.ScheduleLogs.Add(newScheduleLog);
    		BeforeCreate(newScheduleLog, scheduleLog);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newScheduleLog);
    			return Ok(new { scheduleLog = newScheduleLog.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.ScheduleLog"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.ScheduleLog"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var scheduleLog = await Context.ScheduleLogs.FindAsync(id);
    		return Ok(new { scheduleLog = scheduleLog.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.ScheduleLog"/> objects.
    	/// </summary>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List() {
    		ThrowIfDisposed();
    		var dtoScheduleLogs = new List<Altask.Data.Dto.ScheduleLog>();
    		var scheduleLog = await Context.ScheduleLogs.ToListAsync();
    
    		foreach(var item in scheduleLog) {
    			dtoScheduleLogs.Add(item.ToDto());
    		}
    
    		return Ok(new { scheduleLogs = dtoScheduleLogs }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.ScheduleLog"/>.
    	/// </summary>
    	/// <param name="scheduleLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.ScheduleLog scheduleLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var scheduleLogEntity = await Context.ScheduleLogs.FindAsync(scheduleLog.Id);
    
    		if (scheduleLogEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("ScheduleLog"));
    		}
    
    		scheduleLogEntity.FromDto(scheduleLog);
    		Context.Entry(scheduleLogEntity).State = EntityState.Modified;
    		BeforeUpdate(scheduleLogEntity, scheduleLog);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(scheduleLogEntity);
    			return Ok(new { scheduleLog = scheduleLogEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}