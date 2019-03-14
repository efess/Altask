using System;
using System.Linq;
using System.Threading;
using Altask.www.Properties;

namespace Altask.www {
    public interface IService
    {
        void Run();
    }

	/// <summary>
	/// Represents the base object on which Altask services derive from.
	/// </summary>
	/// <typeparam name="T"></typeparam>
	public class Service<T> where T : IService {
		protected ApplicationDbContext _context;
		internal Settings Settings = Properties.Settings.Default;
		private static T _instance;
        private Thread _thread;
		protected static object _lock = new object();
		protected int _errorCount = 0;
		protected DateTime? _lastRun;

		public DateTime? LastRun { get { return _lastRun; } }

		public static T Instance
		{
			get
			{
				lock (_lock) {
					if (_instance == null) {
                        _instance = Activator.CreateInstance<T>();
					}
				}

				return _instance;
			}
		}

		public bool Terminated { get; set; }

		public static ServiceDescriptionAttribute GetServiceDescription() {
			var attribute = typeof(T).GetCustomAttributes(typeof(ServiceDescriptionAttribute), true).FirstOrDefault() as ServiceDescriptionAttribute;

			if (attribute != null) {
				return attribute;
			}

			return new ServiceDescriptionAttribute("");
		}

		public void Start() {
			Terminated = false;
			_thread = new Thread(new ThreadStart(Instance.Run));
            _thread.Name = GetServiceDescription().Name;
            _thread.Start();
		}

		public void Terminate() {
			Terminated = true;
            _thread = null;
        }
	}
}