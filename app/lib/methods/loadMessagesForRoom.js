import { InteractionManager } from 'react-native';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import { Q } from '@nozbe/watermelondb';

import buildMessage from './helpers/buildMessage';
import database from '../realm';
import log from '../../utils/log';
import watermelondb from '../database';
import updateMessages from './updateMessages';

// TODO: move to utils
const assignSub = (sub, newSub) => {
	Object.assign(sub, newSub);
};

async function load({ rid: roomId, latest, t }) {
	if (t === 'l') {
		try {
			// RC 0.51.0
			const data = await this.sdk.methodCall('loadHistory', roomId, null, 50, latest);
			if (!data || data.status === 'error') {
				return [];
			}
			return data.messages;
		} catch (e) {
			log(e);
			return [];
		}
	}

	let params = { roomId, count: 50 };
	if (latest) {
		params = { ...params, latest: new Date(latest).toISOString() };
	}
	// RC 0.48.0
	const data = await this.sdk.get(`${ this.roomTypeToApiType(t) }.history`, params);
	if (!data || data.status === 'error') {
		return [];
	}
	return data.messages;
}

export default function loadMessagesForRoom(args) {
	return new Promise(async(resolve, reject) => {
		try {
			const data = await load.call(this, { ...args });

			if (data && data.length) {
				InteractionManager.runAfterInteractions(async() => {
					database.write(() => data.forEach((message) => {
						message = buildMessage(message);
						try {
							database.create('messages', message, true);
							// if it's a thread "header"
							if (message.tlm) {
								database.create('threads', message, true);
							}
							// if it belongs to a thread
							if (message.tmid) {
								message.rid = message.tmid;
								database.create('threadMessages', message, true);
							}
						} catch (e) {
							log(e);
						}
					}));

					await updateMessages(args.rid, data);

					return resolve(data);
				});
			} else {
				return resolve([]);
			}
		} catch (e) {
			log(e);
			reject(e);
		}
	});
}
