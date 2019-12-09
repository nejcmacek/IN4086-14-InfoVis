using System;

namespace flight_merging {
	static class Program {
		static void Main(string[] args) {
			var input = new string[] {
								"./flights-2018-05.csv",
								"./flights-2018-06.csv",
								"./flights-2018-07.csv",
								"./flights-2018-08.csv",
								"./flights-2018-09.csv",
								"./flights-2018-10.csv",
								"./flights-2018-11.csv",
								"./flights-2018-12.csv",
								"./flights-2019-01.csv",
								"./flights-2019-02.csv",
								"./flights-2019-03.csv",
								"./flights-2019-04.csv"
						};
			String output = "";
			for (int i = 0; i < input.Length; i++) {
				var tmp = System.IO.File.ReadAllText(input[i]);
				if (i == 0)
					output = tmp;
				else {
					var ind = tmp.IndexOf("\n") + 1;
					output = output + tmp.Substring(ind);
				}
			}
			System.IO.File.WriteAllText("all-flights.csv", output);
		}
	}
}
