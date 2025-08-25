import { getDatabase } from '../database';
import { UserProfile, UpdateUserProfileRequest } from '@/types';
import { promisify } from 'util';

export class UserProfileService {
  static async getUserProfile(): Promise<UserProfile> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));

    const profile = await get('SELECT * FROM user_profile WHERE id = 1');
    
    if (!profile) {
      // This shouldn't happen due to the default insert, but just in case
      throw new Error('User profile not found');
    }

    return profile as UserProfile;
  }

  static async updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
    const db = await getDatabase();
    const run = promisify(db.getDb().run.bind(db.getDb()));
    const get = promisify(db.getDb().get.bind(db.getDb()));

    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.address !== undefined) {
      updates.push('address = ?');
      values.push(data.address);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone);
    }
    if (data.website !== undefined) {
      updates.push('website = ?');
      values.push(data.website);
    }
    if (data.siren !== undefined) {
      updates.push('siren = ?');
      values.push(data.siren);
    }
    if (data.vat_number !== undefined) {
      updates.push('vat_number = ?');
      values.push(data.vat_number);
    }

    if (updates.length === 0) {
      return this.getUserProfile();
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(1); // ID is always 1

    await run(
      `UPDATE user_profile SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getUserProfile();
  }

  static async getMyAddressForDocuments(): Promise<string> {
    const profile = await this.getUserProfile();
    
    let address = '';
    if (profile.name) {
      address += profile.name + '\n';
    }
    if (profile.address) {
      address += profile.address;
    }
    if (profile.email || profile.phone || profile.website || profile.siren || profile.vat_number) {
      address += '\n';
      if (profile.email) {
        address += '\nEmail: ' + profile.email;
      }
      if (profile.phone) {
        address += '\nPhone: ' + profile.phone;
      }
      if (profile.website) {
        address += '\nWebsite: ' + profile.website;
      }
      if (profile.siren) {
        address += '\nSIREN: ' + profile.siren;
      }
      if (profile.vat_number) {
        address += '\nVAT: ' + profile.vat_number;
      }
    }

    return address.trim();
  }
}