import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { GeneralService } from '../API/general/general.service';

export const ZERO_HOURS = '00:00';
export const TWENTY_FOUR = '24:00';

@Injectable({
  providedIn: 'root'
})
export class CommonCodeService {
  readonly sundayArrayPosition = 0
  readonly saturdayArrayPosition = 6;
  readonly zeroMoment = this.buildDateFromMoment(moment(), ZERO_HOURS);
  readonly midnightMoment = this.buildDateFromMoment(moment(), TWENTY_FOUR);

  constructor(private generalService: GeneralService) { }

  getTomorrow(num) {
    if (num == this.saturdayArrayPosition) {
      return this.sundayArrayPosition;
    }
    return num + 1;
  }

  getYesterday(num) {
    if (num == this.sundayArrayPosition) {
      return this.saturdayArrayPosition;
    }
    return num - 1;
  }

  buildDateFromMoment(yearMonthDay, hour) {
    return moment(yearMonthDay.format('YYYY-MM-DD') + " " + hour, 'YYYY-MM-DD HH:mm');
  }

  addDayIfNeccesary(date1, date2) {
    if (date2 < date1) {
      return date2.add(1, 'days');
    }
    return date2;
  }

  async checkShift(store, now) {
    let daySchedule = store.daysSchedule[now.day()];
    let open = this.buildDateFromMoment(now, daySchedule.open);
    let closes = this.addDayIfNeccesary(open, this.buildDateFromMoment(now, daySchedule.closes));
    let secondOpen;
    let secondCloses;
    if (daySchedule.open) {
      if (daySchedule.open24Hours) {
        const time = await this.generalService.getCalculatedTime();
        return { open: this.zeroMoment, closes: this.midnightMoment, secondOpen: null, secondCloses: null, currentOpen: time.subtract(12, 'hours'), currentCloses: time.add(12, 'hours') }
      }
      open = this.buildDateFromMoment(now, daySchedule.firstOpen);
      closes = this.buildDateFromMoment(now, daySchedule.firstCloses);
      if (daySchedule.secondShift) {
        secondOpen = this.buildDateFromMoment(now, daySchedule.secondOpen);
        secondCloses = this.addDayIfNeccesary(secondOpen, this.buildDateFromMoment(now, daySchedule.secondCloses));
        if (now < secondCloses && secondOpen < now) {
          return { open: open, closes: closes, secondOpen: secondOpen, secondCloses: secondCloses, currentOpen: secondOpen, currentCloses: secondCloses }
        }
        if (now < closes && now > open) {
          return { open: open, closes: closes, secondOpen: secondOpen, secondCloses: secondCloses, currentOpen: open, currentCloses: closes }
        } else {
          return { open: open, closes: closes, secondOpen: secondOpen, secondCloses: secondCloses, currentOpen: null, currentCloses: null }
        }
      }
      if (now < closes && now > open) {
        return { open: open, closes: closes, secondOpen: null, secondCloses: null, currentOpen: open, currentCloses: closes }
      } else {
        return { open: open, closes: closes, secondOpen: null, secondCloses: null, currentOpen: null, currentCloses: null }
      }
    } else {
      return { open: null, closes: null, secondOpen: null, secondCloses: null, currentOpen: null, currentCloses: null }
    }
  }
}
