using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Newtonsoft.Json;

namespace Altask.Data {
	public class Json {
		public static string SerizlieXmlDocument(XmlDocument doc) {
			var result = new Dictionary<string, object>();
			result.Add(doc.DocumentElement.Name, Value(doc.DocumentElement));
			return JsonConvert.SerializeObject(result);
		}

		/// <summary>
		/// Deserializing straight from Xml produces Ugly Json, convert to Dictionaries first to strip out unwanted nesting
		/// </summary>
		/// <param name="node"></param>
		/// <returns></returns>
		private static object Value(XmlNode node) {
			dynamic value;

			//If we hit a complex element
			if (node.HasChildNodes && !(node.FirstChild is XmlText)) {
				//If we hit a collection, it will have children which are also not just text!
				if (node.FirstChild.HasChildNodes && !(node.FirstChild.FirstChild is XmlText)) {
					//want to return a list of Dictionarys for the children's nodes
					//Eat one level of the hierachy and return child nodes as an array
					value = new List<object>();
					foreach (XmlNode childNode in node.ChildNodes) {
						value.Add(Value(childNode));
					}
				} else //regular complex element return childNodes as a dictionary
				  {
					value = new Dictionary<string, object>();
					foreach (XmlNode childNode in node.ChildNodes) {
						value.Add(childNode.Name, Value(childNode));
					}
				}
			} else //Simple element
			  {
				value = node.FirstChild == null ? string.Empty : node.FirstChild.InnerText;
			}

			return value;
		}
	}
}
