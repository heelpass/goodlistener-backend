import {format, parseISO} from "date-fns";

const convertUnixTimeStamp = (inputDate: Date): number => {
  return parseInt((new Date(inputDate).getTime() / 1000).toFixed(0));
}

const convertDateTime = (inputDate: number): String => {
  return format(parseISO(new Date(inputDate * 1000).toLocaleString()), 'yyyy-MM-dd HH:mm:ss');
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