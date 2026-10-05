import { registerIcon } from '@pega/cosmos-react-core';
import * as bank from '@pega/cosmos-react-core/lib/components/Icon/icons/bank.icon';
import * as building from '@pega/cosmos-react-core/lib/components/Icon/icons/building.icon';
import * as calendar from '@pega/cosmos-react-core/lib/components/Icon/icons/calendar.icon';
import * as document from '@pega/cosmos-react-core/lib/components/Icon/icons/document.icon';
import * as flag from '@pega/cosmos-react-core/lib/components/Icon/icons/flag.icon';
import * as folder from '@pega/cosmos-react-core/lib/components/Icon/icons/folder.icon';
import * as shield from '@pega/cosmos-react-core/lib/components/Icon/icons/shield.icon';
import * as user from '@pega/cosmos-react-core/lib/components/Icon/icons/user.icon';
import * as users from '@pega/cosmos-react-core/lib/components/Icon/icons/users.icon';
import * as wallet from '@pega/cosmos-react-core/lib/components/Icon/icons/wallet.icon';

registerIcon(bank, building, calendar, document, flag, folder, shield, user, users, wallet);

export const ICON_NAMES = ['document', 'wallet', 'user', 'building', 'users', 'bank', 'calendar', 'flag', 'folder', 'shield'];

// Used when a card's icon hasn't been chosen in App Studio (matches the Review Application Details setup)
export const DEFAULT_ICONS: Record<string, string> = {
  A: 'document',
  B: 'wallet',
  C: 'user',
  D: 'building',
  E: 'users'
};
