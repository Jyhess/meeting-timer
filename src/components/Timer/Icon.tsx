import React from 'react';
import { Image, ImageStyle } from 'react-native';
import { styles } from '../../styles/Icon.styles';

const iconMap = {
  add: require('../../../assets/icons/add.png'),
  'add-alert': require('../../../assets/icons/add_alert.png'),
  add_circle: require('../../../assets/icons/add_circle.png'),
  'alarm-add': require('../../../assets/icons/alarm_add.png'),
  'arrow-back': require('../../../assets/icons/arrow_back.png'),
  'arrow-drop-down': require('../../../assets/icons/arrow_drop_down.png'),
  backspace: require('../../../assets/icons/backspace.png'),
  bolt: require('../../../assets/icons/bolt.png'),
  check: require('../../../assets/icons/check.png'),
  close: require('../../../assets/icons/close.png'),
  crisis_alert: require('../../../assets/icons/crisis_alert.png'),
  doorbell: require('../../../assets/icons/doorbell.png'),
  flash: require('../../../assets/icons/flash.png'),
  gong: require('../../../assets/icons/gong.png'),
  highlight: require('../../../assets/icons/highlight.png'),
  minus_circle: require('../../../assets/icons/minus_circle.png'),
  music_note: require('../../../assets/icons/music_note.png'),
  no_sound: require('../../../assets/icons/no_sound.png'),
  notifications: require('../../../assets/icons/notifications.png'),
  pause: require('../../../assets/icons/pause.png'),
  pause_circle: require('../../../assets/icons/pause_circle.png'),
  'pause-circle': require('../../../assets/icons/pause_circle.png'),
  'play-arrow': require('../../../assets/icons/play_arrow.png'),
  'play-circle': require('../../../assets/icons/play_circle.png'),
  remove: require('../../../assets/icons/remove.png'),
  resume: require('../../../assets/icons/resume.png'),
  room_service: require('../../../assets/icons/room_service.png'),
  schedule: require('../../../assets/icons/schedule.png'),
  settings: require('../../../assets/icons/settings.png'),
  siren: require('../../../assets/icons/siren.png'),
  stop: require('../../../assets/icons/stop.png'),
  'stop-circle': require('../../../assets/icons/stop_circle.png'),
  target: require('../../../assets/icons/target.png'),
  'toggle-on': require('../../../assets/icons/toggle_on.png'),
  'toggle-off': require('../../../assets/icons/toggle_off.png'),
  vibration: require('../../../assets/icons/vibration.png'),
  'volume-off': require('../../../assets/icons/volume_off.png'),
};

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ImageStyle;
};

export function Icon({ name, size = 24, color, style }: IconProps) {
  return (
    <Image
      source={iconMap[name]}
      style={[
        {
          width: size,
          height: size,
          tintColor: color,
        },
        style,
      ]}
    />
  );
}
