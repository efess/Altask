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
    public partial class AssetController : BaseController<Altask.Data.Model.Asset, Altask.Data.Dto.Asset>
    {
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	public AssetController() : base() {
    	
    	}
    
    	/// <summary>
    	/// Constructor
    	/// </summary>
    	/// <param name="userManager">The application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.</param>
    	/// <param name="signInManager">The application sign-in manager which is used in this application.</param>
    	public AssetController(ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(userManager, signInManager) {
    
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Create a <see cref="Altask.Data.Model.Asset"/>.
    	/// </summary>
    	/// <param name="asset"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Create(Altask.Data.Dto.Asset asset) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var newAsset = new Altask.Data.Model.Asset().FromDto(asset);
    		Context.Assets.Add(newAsset);
    		BeforeCreate(newAsset, asset);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(newAsset).Collection(e => e.Alerts).Load();
    		Context.Entry(newAsset).Collection(e => e.Groups).Load();
    		Context.Entry(newAsset).Reference(e => e.Type).Load();
    		Context.Entry(newAsset).Reference(e => e.Department).Load();
    		Context.Entry(newAsset).Reference(e => e.Manufacturer).Load();
        
        	if (result.Succeeded) {
    			await AfterCreateAsync(newAsset);
    			return Ok(new { asset = newAsset.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a <see cref="Altask.Data.Model.Asset"/> having the specified ID.
    	/// </summary>
    	/// <param name="id">The ID of the <see cref="Altask.Data.Model.Asset"/>.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> FindById(int id) {
    		ThrowIfDisposed();
    		var asset = await Context.Assets.FindAsync(id);
    		return Ok(new { asset = asset.ToDto() }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpGet]
    	[JsonNetFilter]
    	/// <summary>
    	/// Returns a collection of <see cref="Altask.Data.Model.Asset"/> objects matching the specified filter.
    	/// </summary>
    	/// <param name="filter">A <see cref="Altask.www.Models.AssetListOptions"/> object on which to filter.</param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> List(AssetListOptions filter) {
    		ThrowIfDisposed();
    
    		if (filter == null) {
    			filter = new AssetListOptions();
    		}
    
    		var dtoAssets = new List<Altask.Data.Dto.Asset>();
    		var asset = await Context.Assets.AsNoTracking().Where(filter.GetPredicate())
    			.Include(e => e.Type)
    			.Include(e => e.Department)
    			.Include(e => e.Manufacturer)
    			.Include(e => e.Alerts)
    			.Include(e => e.Groups)
    			.ToListAsync();
    
    		foreach(var item in asset) {
    			dtoAssets.Add(item.ToDto());
    		}
    
    		return Ok(new { assets = dtoAssets }, JsonRequestBehavior.AllowGet);
    	}
    
    	[HttpPost]
    	[JsonNetFilter]
    	/// <summary>
    	/// Updates the specified <see cref="Altask.Data.Model.Asset"/>.
    	/// </summary>
    	/// <param name="asset"></param>
    	/// <returns>Returns a <see cref="Altask.Data.EntityResult"/> indicating success or failure.</returns>
    	public virtual async Task<ActionResult> Update(Altask.Data.Dto.Asset asset) {
    		ThrowIfDisposed();
    
    		if (!ModelState.IsValid) {
    			return BadRequest(ModelState);
    		}
    
    		var assetEntity = await Context.Assets.FindAsync(asset.Id);
    
    		if (assetEntity == null) {
    			return BadRequest(ErrorDescriber.DoesNotExist("Asset"));
    		}
    
    		assetEntity.FromDto(asset);
    		Context.Entry(assetEntity).State = EntityState.Modified;
    		BeforeUpdate(assetEntity, asset);
    		var result = await Context.SaveChangesAsync();
    		Context.Entry(assetEntity).Collection(e => e.Alerts).Load();
    		Context.Entry(assetEntity).Collection(e => e.Groups).Load();
    		Context.Entry(assetEntity).Reference(e => e.Type).Load();
    		Context.Entry(assetEntity).Reference(e => e.Department).Load();
    		Context.Entry(assetEntity).Reference(e => e.Manufacturer).Load();
        
        	if (result.Succeeded) {
    			await AfterUpdateAsync(assetEntity);
    			return Ok(new { asset = assetEntity.ToDto() });
        	} else {
        		return BadRequest(result);
        	}
    	}
    }
}
