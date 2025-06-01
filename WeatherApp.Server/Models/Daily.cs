namespace WeatherApp.Server.Models
{
    public class Daily
    {
        public List<string>? Time { get; set; }
        public List<double>? Temperature_2m_Max { get; set; }
        public List<double>? Temperature_2m_Min { get; set; }
    }
}
