import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {ConfigService} from './config.service';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly url: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.url = config.firebaseUrl;
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        } else {
          return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
        }
      }));
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${this.url}/${task.date}.json`, task)
      .pipe(map(res => {
        console.log(res);
        return {...task, id: res.name};
      }));
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${this.url}/${task.date}/${task.id}.json`);
  }
}
