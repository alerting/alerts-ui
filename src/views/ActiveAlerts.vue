<template>
  <div class="w-100">
    <div class="text-right w-100 mb-0 refresh-btn">
      <b-btn v-on:click="fetch" variant="outline-dark" size="sm" class="round" :disabled="!loaded">
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': !loaded }"><span class="sr-only">Refresh</span></i>
      </b-btn>
    </div>
    <div v-if="loaded" >
      <hit v-for="hit in hits" :key="hit.id" :hit="hit" />
    </div>
    <div v-else class="text-center">
      <p class="h1 pt-4"><i class="fas fa-sync-alt fa-spin large" /><br /><span class="h5">Loading...</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import URI from 'urijs';
import Hit from '@/components/Hit.vue';

@Component({
  components: { Hit },
  watch: {
    '$route': 'routeChanged',
  },
})
export default class ActiveAlerts extends Vue {
  private fetchNum: number = 0;
  private system: string = '';

  private total: number = 0;
  private hits: object[] = [];
  private loaded: boolean = false;

  public async fetch() {
    this.loaded = false;
    const url = new URI('https://alerts.zacharyseguin.ca/api/alerts/active');
    const count = 20;
    const fetchNum = ++this.fetchNum;

    url.setQuery('language', 'en-*');
    url.setQuery('status', 'actual');
    url.setQuery('sort', '-effective');
    url.setQuery('system', this.system || '');
    url.setQuery('count', count.toString());
    // tslint:disable-next-line:max-line-length
    url.setQuery('fields', 'system,headline,senderName,effective,expires,urgency,severity,certainty,responseTypes,areas.description');

    // Do initial request
    let response = await fetch(url.toString()).then((r) => r.json());
    if (this.fetchNum !== fetchNum) {
        return;
      }

    this.total = response.total;
    this.hits = response.hits;

    // Load remaining alerts
    for (let i = count; i < this.total; i += count) {
      url.setQuery('start', i.toString());
      response = await fetch(url.toString()).then((r) => r.json());

      if (this.fetchNum !== fetchNum) {
        return;
      }
      this.hits = this.hits.concat(response.hits);
    }

    this.loaded = true;
  }

  private routeChanged(n: any, old: any): void {
    if (n.meta.system && n.meta.system !== this.system) {
      this.system = n.meta.system;
      this.fetch();
    }
  }

  public mounted(): void {
    this.system = this.$route.meta.system;
    this.fetch();
  }
}
</script>

<style lang="scss" scoped>
.refresh-btn {
  position: relative;
  bottom: 65px;
  height: 0;
}
</style>
