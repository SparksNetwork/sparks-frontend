import { create } from '@most/create';
import {
  Repository,
} from '../types/repository';

export function getFirebaseStream(fbDb: Repository, eventName: string, ref: string) {
  return create((add, end, error) => {
    void end, error;
    const cb = fbDb.ref(ref).on(eventName, function (snapshot: any) {
      const value: any = snapshot.val();
      add(value);
    });

    return function disposeFirebaseListener() {
      fbDb.ref(ref).off(eventName, cb);
    }
  });
}
