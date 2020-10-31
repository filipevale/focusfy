export const parseIcon = (code, hour) => {
  var tag = "wi wi-";
  var time = "";

  if (hour) {
    if (hour <= 6 || hour >= 18) {
      time = "night-";
    } else {
      time = "day-";
    }
  } else {
    time = "day-";
  }

  tag += time;

  switch (code) {
    case 200:
    case 201:
    case 202:
      tag += "sleet-storm";
      break;
    case 230:
    case 231:
    case 232:
    case 233:
      tag += "thunderstorm";
      break;
    case 300:
    case 301:
    case 302:
    case 500:
      tag += "rain-mix";
      break;
    case 501:
    case 511:
    case 520:
    case 623:
    case 900:
      tag += "rain";
      break;
    case 502:
    case 522:
      tag += "rain-wind";
      break;
    case 521:
      tag += "day-hail";
      break;
    case 600:
    case 601:
    case 602:
    case 622:
    case 622:
      tag += "snow";
      break;
    case 610:
      tag += "snow-thunderstorm";
      break;

    case 611:
    case 612:
      tag += "hail";
      break;
    case 700:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
      tag += "fog";
      break;
    case 800:
      if (time === "day-") {
        tag += "sunny";
      } else {
        tag += "clear";
      }
      break;
    case 801:
    case 802:
    case 803:
    case 804:
      tag += "cloudy";
      break;
    default:
      tag += "clear";
      break;
  }
  return tag;
};
