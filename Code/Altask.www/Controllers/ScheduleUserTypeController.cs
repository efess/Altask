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
    public partial class ScheduleUserTypeController : BaseController<Altask.Data.Model.ScheduleUserType, Altask.Data.Dto.ScheduleUserType>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public ScheduleUserTypeController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public ScheduleUserTypeController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.ScheduleUserType"/>.
    	/// </summary>
    	/// <param name="scheduleUserType"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.ScheduleUserType scheduleUserType) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newScheduleUserType = new Altask.Data.Model.ScheduleUserType().FromDto(scheduleUserType);
    		Context.ScheduleUserTypes.Add(newScheduleUserType);
    		BeforeCreate(newScheduleUserType, scheduleUserType);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newScheduleUserType);
    			return Ok(new { scheduleUserType = newScheduleUserType.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.ScheduleUserType"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.ScheduleUserType"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(int id) {
    		ThrowIfDisposed();
    		var scheduleUserType = await Context.ScheduleUserTypes.FindAsync(id);
    		return Ok(new { scheduleUserType = scheduleUserType.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.ScheduleUserType"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.ScheduleUserTypeListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(ScheduleUserTypeListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new ScheduleUserTypeListOptions();
    		}
    
    		var dtoScheduleUserTypes = new List<Altask.Data.Dto.ScheduleUserType>();
    		var scheduleUserType = await Context.ScheduleUserTypes.AsNoTracking().Where(filter.GetPredicate())
    			.ToListAsync();
    
    		foreach(var item in scheduleUserType) {
    			dtoScheduleUserTypes.Add(item.ToDto());
    		}
    
    		return Ok(new { scheduleUserTypes = dtoScheduleUserTypes }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.ScheduleUserType"/>.
    	/// </summary>
    	/// <param name="scheduleUserType"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.ScheduleUserType scheduleUserType) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var scheduleUserTypeEntity = await Context.ScheduleUserTypes.FindAsync(scheduleUserType.Id);
    
    		if (scheduleUserTypeEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("ScheduleUserType"));
    		}
    
    		scheduleUserTypeEntity.FromDto(scheduleUserType);
    		Context.Entry(scheduleUserTypeEntity).State = EntityState.Modified;
    		BeforeUpdate(scheduleUserTypeEntity, scheduleUserType);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(scheduleUserTypeEntity);
    			return Ok(new { scheduleUserType = scheduleUserTypeEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
