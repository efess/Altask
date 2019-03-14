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
    public partial class AssetGroupingController : BaseController<Altask.Data.Model.AssetGrouping, Altask.Data.Dto.AssetGrouping>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public AssetGroupingController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public AssetGroupingController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.AssetGrouping"/>.
    	/// </summary>
    	/// <param name="assetGrouping"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.AssetGrouping assetGrouping) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newAssetGrouping = new Altask.Data.Model.AssetGrouping().FromDto(assetGrouping);
    		Context.AssetGroupings.Add(newAssetGrouping);
    		BeforeCreate(newAssetGrouping, assetGrouping);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newAssetGrouping).Reference(e => e.Group).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newAssetGrouping);
    			return Ok(new { assetGrouping = newAssetGrouping.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.AssetGrouping"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.AssetGrouping"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(long id) {
    		ThrowIfDisposed();
    		var assetGrouping = await Context.AssetGroupings.FindAsync(id);
    		return Ok(new { assetGrouping = assetGrouping.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.AssetGrouping"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.AssetGroupingListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(AssetGroupingListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new AssetGroupingListOptions();
    		}
    
    		var dtoAssetGroupings = new List<Altask.Data.Dto.AssetGrouping>();
    		var assetGrouping = await Context.AssetGroupings.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.Group)
    			.ToListAsync();
    
    		foreach(var item in assetGrouping) {
    			dtoAssetGroupings.Add(item.ToDto());
    		}
    
    		return Ok(new { assetGroupings = dtoAssetGroupings }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.AssetGrouping"/>.
    	/// </summary>
    	/// <param name="assetGrouping"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.AssetGrouping assetGrouping) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var assetGroupingEntity = await Context.AssetGroupings.FindAsync(assetGrouping.Id);
    
    		if (assetGroupingEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("AssetGrouping"));
    		}
    
    		assetGroupingEntity.FromDto(assetGrouping);
    		Context.Entry(assetGroupingEntity).State = EntityState.Modified;
    		BeforeUpdate(assetGroupingEntity, assetGrouping);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(assetGroupingEntity).Reference(e => e.Group).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(assetGroupingEntity);
    			return Ok(new { assetGrouping = assetGroupingEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
