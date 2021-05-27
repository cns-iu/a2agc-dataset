import { Injectable } from '@angular/core';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';


@StateRepository()
@State<unknown>({
  name: 'page',
  defaults: { }
})
@Injectable()
export class PageState extends NgxsImmutableDataRepository<unknown> { }
