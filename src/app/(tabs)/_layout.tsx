import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

import { TabBar, TabBarButton } from '@/components/TabBar';
import { areas } from '@/theme';

/** Bottom tabs: Today, Goals, Habits, Calendar — each with its own colour. */
export default function TabLayout() {
  return (
    <Tabs>
      {/* Let the screen area shrink so the tab bar always fits. */}
      <TabSlot style={{ flexShrink: 1 }} />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabBarButton icon="today" label="Today" color={areas.today.fill} soft={areas.today.soft} />
          </TabTrigger>
          <TabTrigger name="goals" href="/goals" asChild>
            <TabBarButton icon="goals" label="Goals" color={areas.goals.fill} soft={areas.goals.soft} />
          </TabTrigger>
          <TabTrigger name="habits" href="/habits" asChild>
            <TabBarButton icon="habits" label="Habits" color={areas.habits.fill} soft={areas.habits.soft} />
          </TabTrigger>
          <TabTrigger name="calendar" href="/calendar" asChild>
            <TabBarButton icon="calendar" label="Calendar" color={areas.calendar.fill} soft={areas.calendar.soft} />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}
