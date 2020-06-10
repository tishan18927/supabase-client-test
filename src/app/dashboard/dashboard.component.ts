import { Component, OnInit } from '@angular/core';
import { Socket } from '@supabase/realtime-js'
import { ToastrService } from 'ngx-toastr';

const REALTIME_URL = 'ws://qa.csi.local:4000/socket'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private toaster: ToastrService) { }

  userChanges: any;
  schemaChanges: any;
  allChanges: any;


  ngOnInit() {
    var socket = new Socket(REALTIME_URL)
    socket.connect()

    // Listen to only INSERTS on the 'users' table in the 'public' schema
    // this.userChanges = socket.channel('realtime:public:users');
    // this.userChanges.join();
    // this.userChanges.on('INSERT', payload => { console.log('Update received!', payload) });

    // Listen to all changes from the 'public' schema
    this.schemaChanges = socket.channel('realtime:public');
    this.schemaChanges.join()
    this.schemaChanges.on('*', payload => { 
      console.log('Update received!', payload);
      this.toaster.success(JSON.stringify(payload.record), `${payload.type}-->${payload.schema}:${payload.table}`)
    })

    // Listen to all changes in the database
    // this.allChanges = socket.channel('realtime:*');
    // this.allChanges.join();
    // this.allChanges.on('*', payload => { console.log('Update received!', payload) });
  }

}
