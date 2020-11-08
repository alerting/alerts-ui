<template>
  <div class="w-100">
    <h1>For you</h1>

    <div class="d-flex justify-content-between w-100 mb-3">
      <p>&nbsp;</p>
      <b-btn v-on:click="fetch" variant="outline-dark" size="sm" class="round" :disabled="loading">
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"><span class="sr-only">Refresh</span></i>
      </b-btn>
    </div>

    <div v-if="error">
      <p class="h1 text-center">
        <i class="fas fa-exclamation-triangle text-warning large" />
        <br />
        <span class="h5">{{ error }}</span>
      </p>
    </div>
    <div class="w-100" v-else-if="!loading">
      <div v-if="total === 0">
        <p class="h1 text-center">
          <i class="fas fa-check-square text-success large" />
          <br />
          <span class="h5">There are no active alerts for your location.</span>
        </p>
      </div>
      <div v-else>
        <p>{{ total }} alerts</p>

        <div>
          <hit v-for="hit in hits" :key="hit.id" :hit="hit" />
        </div>
      </div>
    </div>
    <div v-else-if="locating">
      <p class="h1 text-center">
        <i class="fas fa-crosshairs fa-spin large" />
        <br />
        <span class="h5">Locating...</span>
      </p>
    </div>
    <div v-else>
      <p class="h1 text-center">
        <i class="fas fa-sync-alt fa-spin large" />
        <br />
        <span class="h5">Fetching...</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import URI from 'urijs';
import Hit from '@/components/Hit.vue';

@Component({
  components: { Hit },
})
export default class ForYou extends Vue {
  private total: number = 0;
  private hits: object[] = [];

  private locating: boolean = true;
  private loading: boolean = true;
  private error: any = null;

  public fetch(): void {
    this.loading = true;
    this.locating = true;
    this.error = null;

    this.$getLocation().then((coords: any) => {
      this.locating = false;

      const url = new URI('https://alerts.zacharyseguin.ca/api/alerts/active');

      url.setQuery('language', 'en-*');
      url.setQuery('status', 'actual');
      url.setQuery('sort', '-effective');
      // url.setQuery('system', 'naads');
      url.setQuery('count', '10');
      // tslint:disable-next-line:max-line-length
      url.setQuery('fields', 'system,headline,senderName,effective,expires,urgency,severity,certainty,responseTypes,areas.description');
      url.setQuery('point', `${coords.lat},${coords.lng}`);

      fetch(url.toString())
        .then((r) => r.json())
        .then((r) => {
          this.total = parseInt(r.total, 10);
          this.hits = r.hits;

          this.loading = false;
        });
    }, (err: string) => {
      console.log(err);
      this.loading = false;
      this.locating = false;

      if (err === "no position access") {
        this.error = "Permission to access your location is required to show personalized alerts.";
      } else {
        this.error = "Unable to find your location.";
      }
    });
  }

  public mounted(): void {
    this.fetch();
  }
}
</script>
