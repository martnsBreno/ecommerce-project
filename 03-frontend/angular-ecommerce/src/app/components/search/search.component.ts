import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) { }

  doSearch(arg0: string) {
    console.log(`value= ${arg0}`);
    this.router.navigateByUrl(`/search/${arg0}`);
  }


  ngOnInit(): void {
  }

}
