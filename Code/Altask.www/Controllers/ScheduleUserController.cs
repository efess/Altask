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
    public partial class ScheduleUserController : BaseController<Altask.Data.Model.ScheduleUser, Altask.Data.Dto.ScheduleUser>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public ScheduleUserController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public ScheduleUserController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.ScheduleUser"/>.
    	/// </summary>
    	/// <param name="scheduleUser"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.ScheduleUser scheduleUser) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newScheduleUser = new Altask.Data.Model.ScheduleUser().FromDto(scheduleUser);
    		Context.ScheduleUsers.Add(newScheduleUser);
    		BeforeCreate(newScheduleUser, scheduleUser);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newScheduleUser).Reference(e => e.Schedule).Load();
    		Context.Entry(newScheduleUser).Reference(e => e.ScheduleUserType).Load();
    		Context.Entry(newScheduleUser).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newScheduleUser);
    			return Ok(new { scheduleUser = newScheduleUser.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.ScheduleUser"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.ScheduleUser"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var scheduleUser = await Context.ScheduleUsers.FindAsync(id);
    		return Ok(new { scheduleUser = scheduleUser.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.ScheduleUser"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.ScheduleUserListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(ScheduleUserListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new ScheduleUserListOptions();
    		}
    
    		var dtoScheduleUsers = new List<Altask.Data.Dto.ScheduleUser>();
    		var scheduleUser = await Context.ScheduleUsers.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.Schedule)
    			.Include(e => e.ScheduleUserType)
    			.Include(e => e.User)
    			.ToListAsync();
    
    		foreach(var item in scheduleUser) {
    			dtoScheduleUsers.Add(item.ToDto());
    		}
    
    		return Ok(new { scheduleUsers = dtoScheduleUsers }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.ScheduleUser"/>.
    	/// </summary>
    	/// <param name="scheduleUser"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.ScheduleUser scheduleUser) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var scheduleUserEntity = await Context.ScheduleUsers.FindAsync(scheduleUser.Id);
    
    		if (scheduleUserEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("ScheduleUser"));
    		}
    
    		scheduleUserEntity.FromDto(scheduleUser);
    		Context.Entry(scheduleUserEntity).State = EntityState.Modified;
    		BeforeUpdate(scheduleUserEntity, scheduleUser);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(scheduleUserEntity).Reference(e => e.Schedule).Load();
    		Context.Entry(scheduleUserEntity).Reference(e => e.ScheduleUserType).Load();
    		Context.Entry(scheduleUserEntity).Reference(e => e.User).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(scheduleUserEntity);
    			return Ok(new { scheduleUser = scheduleUserEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
