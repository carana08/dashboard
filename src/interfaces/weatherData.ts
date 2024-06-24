// interface WeatherData {
//     main: {
//       temp: number;
//       humidity: number;
//     };
//     weather: {
//       description: string;
//     }[];
//     name: string;
//   }
export interface WeatherData {
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  // uv: {
  //   value: number;
  // }; // Asegúrate de que la API realmente devuelve este campo o ajusta según sea necesario.
}