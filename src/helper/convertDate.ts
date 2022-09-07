import {format, parseISO} from "date-fns";

const convertUnixTimeStamp = (inputDate: Date): number => {
  return parseInt((new Date(inputDate).getTime() / 1000).toFixed(0));
  // return new Date(inputDate).getTime();
}

const convertDateTime = (inputDate: Date): String => {
  return format(new Date(inputDate), 'yyyy-MM-dd HH:mm');
}

const convertFitNotInQuery = (inputDate: Date): String => {
  let oneWeekArr = [];
  for(let i=0; i<7;i++) {
    oneWeekArr.push(convertUnixTimeStamp(inputDate) + (86400 * (i)));
  }
  return oneWeekArr.join();
}

export {
  convertUnixTimeStamp,
  convertDateTime,
  convertFitNotInQuery
}