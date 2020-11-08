<template>
  <div class="w-100">
    <h1>Active alerts</h1>

    <b-nav tabs>
      <b-nav-item :to="{ name: 'active-canada' }" active-class="active" exact>Canada ({{ totals.ca < 0 ? '...' : totals.ca }})</b-nav-item>
      <b-nav-item :to="{ name: 'active-us' }" active-class="active" exact>United States ({{ totals.us < 0 ? '...' : totals.us }})</b-nav-item>
    </b-nav>

    <keep-alive><router-view class="mt-3" /></keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import URI from 'urijs';
import ActiveAlerts from '@/views/ActiveAlerts.vue';

@Component({
  components: { ActiveAlerts },
})
export default class Active extends Vue {
  private totals: any = {
    ca: -1,
    us: -1,
  };

  private fetch(system: string): Promise<any> {
    const url = new URI('https://alerts.zacharyseguin.ca/api/alerts/active');

    url.setQuery('language', 'en-*');
    url.setQuery('status', 'actual');
    url.setQuery('count', '1');
    url.setQuery('system', system);

    return fetch(url.toString())
      .then((r) => r.json());
  }

  public mounted(): void {
    this.fetch('naads').then(r => this.totals.ca = r.total);
    this.fetch('nws').then(r => this.totals.us = r.total);
  }
}
</script>
