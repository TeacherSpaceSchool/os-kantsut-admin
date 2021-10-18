import { openDB } from 'idb';
export let db = undefined
export let startIDB = async () => {
    if (window.indexedDB) {
        db = await openDB('C10b11bd-afvr-46e2-99b3-554541782', 1, {
            upgrade(db) {

            },
        });
    }
}


