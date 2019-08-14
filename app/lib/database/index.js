import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './model/schema';
import Subscription from './model/Subscription' // ⬅️ You'll import your Models here

const adapter = new SQLiteAdapter({
	dbName: 'WatermelonDemo',
	schema,
})

const database = new Database({
	adapter,
	modelClasses: [Subscription],
	actionsEnabled: true,
})

export default database;
