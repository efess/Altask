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
    public partial class OccurrenceLogController : BaseController<Altask.Data.Model.OccurrenceLog, Altask.Data.Dto.OccurrenceLog>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public OccurrenceLogController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public OccurrenceLogController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.OccurrenceLog"/>.
    	/// </summary>
    	/// <param name="occurrenceLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.OccurrenceLog occurrenceLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newOccurrenceLog = new Altask.Data.Model.OccurrenceLog().FromDto(occurrenceLog);
    		Context.OccurrenceLogs.Add(newOccurrenceLog);
    		BeforeCreate(newOccurrenceLog, occurrenceLog);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newOccurrenceLog);
    			return Ok(new { occurrenceLog = newOccurrenceLog.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.OccurrenceLog"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.OccurrenceLog"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var occurrenceLog = await Context.OccurrenceLogs.FindAsync(id);
    		return Ok(new { occurrenceLog = occurrenceLog.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.OccurrenceLog"/> objects.
    	/// </summary>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List() {
    		ThrowIfDisposed();
    		var dtoOccurrenceLogs = new List<Altask.Data.Dto.OccurrenceLog>();
    		var occurrenceLog = await Context.OccurrenceLogs.ToListAsync();
    
    		foreach(var item in occurrenceLog) {
    			dtoOccurrenceLogs.Add(item.ToDto());
    		}
    
    		return Ok(new { occurrenceLogs = dtoOccurrenceLogs }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.OccurrenceLog"/>.
    	/// </summary>
    	/// <param name="occurrenceLog"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.OccurrenceLog occurrenceLog) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var occurrenceLogEntity = await Context.OccurrenceLogs.FindAsync(occurrenceLog.Id);
    
    		if (occurrenceLogEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("OccurrenceLog"));
    		}
    
    		occurrenceLogEntity.FromDto(occurrenceLog);
    		Context.Entry(occurrenceLogEntity).State = EntityState.Modified;
    		BeforeUpdate(occurrenceLogEntity, occurrenceLog);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(occurrenceLogEntity);
    			return Ok(new { occurrenceLog = occurrenceLogEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
