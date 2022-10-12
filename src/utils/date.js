import moment from "moment-timezone";

export const formatDate = (date, format) => moment(date).format(format);
