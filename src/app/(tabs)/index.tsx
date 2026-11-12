import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { HeaderBlock } from '@/components/HeaderBlock';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { Tile } from '@/components/Tile';
import { areas, colors, fonts, onColor, type } from '@/theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Small see-through stat on the header ("0% today"). */
function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** Today: score, streak and today's habits, goals and plan. Example cards until phase 2. */
export default function TodayScreen() {
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen
      header={
        <HeaderBlock
          title={greeting()}
          subtitle={date}
          action={{ icon: 'gear', label: 'Settings', onPress: () => router.push('/settings') }}>
          <View style={styles.stats}>
            <HeaderStat value="0%" label="Today's score" />
            <HeaderStat value="0" label="Day streak" />
            <HeaderStat value="0/0" label="Habits done" />
          </View>
        </HeaderBlock>
      }>
      <Shelf title="Today's habits" onSeeAll={() => router.push('/habits')}>
        <Tile title="Drink 8 glasses of water" tag="Example" footer="0 of 8 glasses" progress={0} color={areas.habits.fill} />
        <Tile title="Read for 20 minutes" tag="Example" footer="Evening" color={areas.habits.fill} />
        <Tile title="Walk 8,000 steps" tag="Example" footer="Every day" color={areas.habits.fill} />
      </Shelf>

      <Shelf title="Goals to push" onSeeAll={() => router.push('/goals')}>
        <Tile
          title="Save £5,000 by March"
          tag="Behind"
          footer="Need £29 a day"
          progress={0.36}
          color={areas.goals.fill}
          onPress={() => router.push('/goal/sample')}
        />
        <Tile title="Finish my Spanish course" tag="On track" footer="Unit 6 of 12" progress={0.5} color={areas.goals.fill} />
      </Shelf>

      <Shelf title="Your time today" onSeeAll={() => router.push('/calendar')}>
        <Tile title="Spanish practice" tag="6:30 pm" footer="45 min · free slot" color={areas.calendar.fill} />
        <Tile title="Budget check" tag="8:00 pm" footer="15 min · free slot" color={areas.calendar.fill} />
      </Shelf>

      <View style={styles.note}>
        <Icon name="star" size={16} color={colors.inkMuted} />
        <Text style={[type.caption, styles.noteText]}>Example cards for now. Your own habits and goals arrive in phases 2 and 3.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: onColor.glass,
  },
  statValue: {
    fontFamily: fonts.heavy,
    fontSize: 22,
    color: onColor.title,
  },
  statLabel: {
    fontFamily: fonts.semi,
    fontSize: 11,
    color: onColor.body,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteText: {
    flex: 1,
  },
});
