namespace WeatherApp.Server.Models
{
    public class WeatherResponse
    {
        public Daily? Daily { get; set; }
        public string? Admin1 { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }

        public WeatherResponse WithLocation(LocationResult location)
        {
            City = location.Name;
            Admin1 = location.Admin1;
            Country = location.Country;
            return this;
        }
    }
}
