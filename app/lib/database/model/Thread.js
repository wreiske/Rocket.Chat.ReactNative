import { Model } from '@nozbe/watermelondb';
import {
	field, relation, date, json
} from '@nozbe/watermelondb/decorators';

const sanitizer = r => r;

export default class Thread extends Model {
	static table = 'threads';

	static associations = {
		subscriptions: { type: 'belongs_to', key: 'rid' }
	}

	@field('msg') msg;

	@field('t') t;

	@date('ts') ts;

	@json('u', sanitizer) u;

	@relation('subscriptions', 'rid') subscription

	@field('alias') alias;

	@json('parse_urls', sanitizer) parseUrls;

	@field('groupable') groupable;

	@field('avatar') avatar;

	@json('attachments', sanitizer) attachments;

	@json('urls', sanitizer) urls;

	@date('updated_at') updatedAt;

	@field('status') status;

	@field('pinned') pinned;

	@field('starred') starred;

	@json('edited_by', sanitizer) editedBy;

	@json('reactions', sanitizer) reactions;

	@field('role') role;

	@field('drid') drid;

	@field('dcount') dcount;

	@field('dlm') dlm;

	@field('timd') timd;

	@field('tcount') tcount;

	@field('tlm') tlm;

	@json('replies', sanitizer) replies;

	@json('mentions', sanitizer) mentions;

	@json('channels', sanitizer) channels;

	@field('unread') unread;

	@field('auto_translate') autoTranslate;

	@json('translations', sanitizer) translations;
}
