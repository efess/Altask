using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Altask.www.Models {
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    /// <summary>
    ///	Represents a collection of properties on which you can filter a collection of <see cref="Altask.Data.Dto.Task"/> objects.
    /// </summary>
    public partial class ProjectToOptions {
        public ProjectToOptions() {
            FromDate = DateTime.Now.Date;
            ToDate = new DateTime(FromDate.Year, FromDate.Month, FromDate.Day, 23, 59, 59);
        }
        /// <summary>
        /// The date from which the selected Task will be projected to.
        /// </summary>
        public DateTime FromDate { get; set; }
        /// <summary>
        /// The date to which the selected Task will be projected to.
        /// </summary>
        public DateTime ToDate { get; set; }
        /// <summary>
        /// The number of <see cref="Altask.Data.Dto.Task"/> which represent the "parent" <see cref="Altask.Data.Dto.Task"/> to retreive given the sort order.
        /// </summary>
        public int Count { get; set; }

        /// <summary>
		///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Task"/>.AssetIds values to filter on.
		/// </summary>
		public string AssetIds { get; set; }

        /// <summary>
        ///	Parses the AssetIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Task"/>.AssetId values to filter on.
        /// </summary>
        public List<Int64> GetAssetIds() {
            var list = new List<Int64>();

            if (AssetIds != null) {
                var items = AssetIds.Split(',');

                foreach (var item in items) {
                    Int64 parsed;

                    if (Int64.TryParse(item, out parsed)) {
                        list.Add(parsed);
                    }
                }
            }

            return list;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's AssetIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetAssetIdsOccurrencePredicate() {
            var values = GetAssetIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(PredicateBuilder.True<Altask.Data.Model.Occurrence>().And(o => o.AssetId == value));
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's AssetIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Task, bool>> GetAssetIdsTaskPredicate() {
            var values = GetAssetIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Task>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(PredicateBuilder.True<Altask.Data.Model.Task>().And(e => e.Schedules.Any(td => td.Assets.Any(tdu => tdu.AssetId == value))));
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Task"/>.FormId values to filter on.
        /// </summary>
        public string FormIds { get; set; }

        /// <summary>
        ///	Parses the FormIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Task"/>.FormId values to filter on.
        /// </summary>
        public List<Int32> GetFormIds() {
            var list = new List<Int32>();

            if (FormIds != null) {
                var items = FormIds.Split(',');

                foreach (var item in items) {
                    Int32 parsed;

                    if (Int32.TryParse(item, out parsed)) {
                        list.Add(parsed);
                    }
                }
            }

            return list;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's FormIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetFormIdsOccurrencePredicate() {
            var values = GetFormIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(o => o.Task.FormId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's FormIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Task, bool>> GetFormIdsTaskPredicate() {
            var values = GetFormIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Task>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(e => e.FormId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Task"/>.CategoryId values to filter on.
        /// </summary>
        public string CategoryIds { get; set; }

        /// <summary>
        ///	Parses the CategoryIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Task"/>.CategoryId values to filter on.
        /// </summary>
        public List<Int32> GetCategoryIds() {
            var list = new List<Int32>();

            if (CategoryIds != null) {
                var items = CategoryIds.Split(',');

                foreach (var item in items) {
                    Int32 parsed;

                    if (Int32.TryParse(item, out parsed)) {
                        list.Add(parsed);
                    }
                }
            }

            return list;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's CategoryIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetCategoryIdsOccurrencePredicate() {
            var values = GetCategoryIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(o => o.Task.TaskCategoryId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's CategoryIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Task, bool>> GetCategoryIdsTaskPredicate() {
            var values = GetCategoryIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Task>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(e => e.TaskCategoryId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Task"/>.TypeId values to filter on.
        /// </summary>
        public string TypeIds { get; set; }

        /// <summary>
        ///	Parses the TypeIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Task"/>.TypeId values to filter on.
        /// </summary>
        public List<Int32> GetTypeIds() {
            var list = new List<Int32>();

            if (TypeIds != null) {
                var items = TypeIds.Split(',');

                foreach (var item in items) {
                    Int32 parsed;

                    if (Int32.TryParse(item, out parsed)) {
                        list.Add(parsed);
                    }
                }
            }

            return list;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's TypeIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetTypeIdsOccurrencePredicate() {
            var values = GetTypeIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(o => o.Task.TaskTypeId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's TypeIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Task, bool>> GetTypeIdsTaskPredicate() {
            var values = GetTypeIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Task>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(e => e.TaskTypeId == value);
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
		///	A comma delimited string representing one or more <see cref="Altask.Data.Dto.Task"/>.UserIds values to filter on.
		/// </summary>
		public string UserIds { get; set; }

        /// <summary>
        ///	Parses the UserIds property and returns a <see cref="System.Collections.Generic.List{Int32}"/> containing any <see cref="Altask.Data.Dto.Task"/>.UserId values to filter on.
        /// </summary>
        public List<Int64> GetUserIds() {
            var list = new List<Int64>();

            if (UserIds != null) {
                var items = UserIds.Split(',');

                foreach (var item in items) {
                    Int64 parsed;

                    if (Int64.TryParse(item, out parsed)) {
                        list.Add(parsed);
                    }
                }
            }

            return list;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's UserIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Occurrence, bool>> GetUserIdsOccurrencePredicate() {
            var values = GetUserIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Occurrence>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(PredicateBuilder.True<Altask.Data.Model.Occurrence>().And(o => o.UserId == value));
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate derived from the filter's UserIds property.
        /// </summary>
        private Expression<Func<Altask.Data.Model.Task, bool>> GetUserIdsTaskPredicate() {
            var values = GetUserIds();

            if (values.Count > 0) {
                var predicate = PredicateBuilder.False<Altask.Data.Model.Task>();

                foreach (var item in values) {
                    var value = item;
                    predicate = predicate.Or(PredicateBuilder.True<Altask.Data.Model.Task>().And(e => e.Schedules.Any(td => td.Users.Any(tdu => tdu.UserId == value))));
                }

                return predicate;
            }

            return null;
        }

        /// <summary>
        ///	Creates a Predicate from the filter's specified properties which evaluates to true.
        /// </summary>
        public Expression<Func<Altask.Data.Model.Task, bool>> GetTaskPredicate() {
            var predicate = PredicateBuilder.True<Altask.Data.Model.Task>();
            var fromDate = FromDate;
            var toDate = ToDate;
            predicate = predicate.And(PredicateBuilder.True<Altask.Data.Model.Task>().And(
                e => e.Schedules.Any(td => td.StartsOn < ToDate && (td.EndsOn >= FromDate || td.EndsAfter.HasValue))));

            var userIdsPredicate = GetUserIdsTaskPredicate();

            if (userIdsPredicate != null) {
                predicate = predicate.And(userIdsPredicate);
            }

            var assetIdsPredicate = GetAssetIdsTaskPredicate();

            if (assetIdsPredicate != null) {
                predicate = predicate.And(assetIdsPredicate);
            }

            var formIdsPredicate = GetFormIdsTaskPredicate();

            if (formIdsPredicate != null) {
                predicate = predicate.And(formIdsPredicate);
            }

            var taskCategoryIdsPredicate = GetCategoryIdsTaskPredicate();

            if (taskCategoryIdsPredicate != null) {
                predicate = predicate.And(taskCategoryIdsPredicate);
            }

            var taskTypeIdsPredicate = GetTypeIdsTaskPredicate();

            if (taskTypeIdsPredicate != null) {
                predicate = predicate.And(taskTypeIdsPredicate);
            }

            return predicate;

        }

        /// <summary>
        ///	Creates a Predicate from the filter's specified properties which evaluates to true.
        /// </summary>
        public Expression<Func<Altask.Data.Model.Occurrence, bool>> GetOccurrencePredicate() {
            var predicate = PredicateBuilder.True<Altask.Data.Model.Occurrence>();
            var fromDate = FromDate;
            var toDate = ToDate;
            predicate = predicate.And(PredicateBuilder.True<Altask.Data.Model.Occurrence>().And(o => o.Date >= fromDate && o.Date <= toDate));

            var userIdsPredicate = GetUserIdsOccurrencePredicate();

            if (userIdsPredicate != null) {
                predicate = predicate.And(userIdsPredicate);
            }

            var assetIdsPredicate = GetAssetIdsOccurrencePredicate();

            if (assetIdsPredicate != null) {
                predicate = predicate.And(assetIdsPredicate);
            }

            var formIdsPredicate = GetFormIdsOccurrencePredicate();

            if (formIdsPredicate != null) {
                predicate = predicate.And(formIdsPredicate);
            }

            var taskCategoryIdsPredicate = GetCategoryIdsOccurrencePredicate();

            if (taskCategoryIdsPredicate != null) {
                predicate = predicate.And(taskCategoryIdsPredicate);
            }

            var taskTypeIdsPredicate = GetTypeIdsOccurrencePredicate();

            if (taskTypeIdsPredicate != null) {
                predicate = predicate.And(taskTypeIdsPredicate);
            }

            return predicate;
        }
    }
}