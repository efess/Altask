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
    public partial class SettingController : BaseController<Altask.Data.Model.Setting, Altask.Data.Dto.Setting>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public SettingController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public SettingController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.Setting"/>.
    	/// </summary>
    	/// <param name="setting"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.Setting setting) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newSetting = new Altask.Data.Model.Setting().FromDto(setting);
    		Context.Settings.Add(newSetting);
    		BeforeCreate(newSetting, setting);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newSetting);
    			return Ok(new { setting = newSetting.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.Setting"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.Setting"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(int id) {
    		ThrowIfDisposed();
    		var setting = await Context.Settings.FindAsync(id);
    		return Ok(new { setting = setting.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.Setting"/> objects.
    	/// </summary>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List() {
    		ThrowIfDisposed();
    		var dtoSettings = new List<Altask.Data.Dto.Setting>();
    		var setting = await Context.Settings.ToListAsync();
    
    		foreach(var item in setting) {
    			dtoSettings.Add(item.ToDto());
    		}
    
    		return Ok(new { settings = dtoSettings }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.Setting"/>.
    	/// </summary>
    	/// <param name="setting"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.Setting setting) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var settingEntity = await Context.Settings.FindAsync(setting.Id);
    
    		if (settingEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("Setting"));
    		}
    
    		settingEntity.FromDto(setting);
    		Context.Entry(settingEntity).State = EntityState.Modified;
    		BeforeUpdate(settingEntity, setting);
    		var result = await Context.SaveChangesAsync();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(settingEntity);
    			return Ok(new { setting = settingEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}