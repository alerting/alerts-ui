<template>
  <router-link :to="{ name: 'alert', params: { id: hit.id } }" class="disable-link">
    <b-card class="w-100 mb-2 hit">
      <div slot="header">
        <div class="d-flex justify-content-between">
          <div>
            <h2 slot="header" class="text-uppercase h4 mb-0">{{ hit.info.headline | headline }}</h2>
            <p class="mt-1 mb-1" v-if="hit.info.senderName">Issued by {{ hit.info.senderName }}</p>
          </div>
          <div class="text-right" style="min-width: 250px;">
            <div>
              <b-badge
                :variant="urgencyVariants.get(hit.info.urgency)"
                class="mr-1"
                v-if="hit.info.urgency"
              >{{ hit.info.urgency }}</b-badge>
              <b-badge
                :variant="severityVariants.get(hit.info.severity)"
                class="mr-1"
                v-if="hit.info.severity"
              >{{ hit.info.severity }}</b-badge>
              <b-badge
                :variant="certaintyVariants.get(hit.info.certainty)"
                v-if="hit.info.certainty"
              >{{ hit.info.certainty }}</b-badge>
            </div>
            <div class="text-right">
              <b-badge
                :variant="responseTypeVariants.get(t)"
                v-for="t in hit.info.responseTypes"
                :key="t"
              >{{ t.replace('_', ' ') }}</b-badge>
            </div>
          </div>
        </div>
      </div>
      <b-card-text>
        <div class="d-flex justify-content-between text-small mt-1 mb-1">
          <p class="mb-0" v-if="hit.info.effective"><strong>Effective</strong><br />{{ hit.info.effective | moment('ll LT') }}</p>
          <p class="mb-0 text-right" v-if="hit.info.expires"><strong>Expires</strong><br />{{ hit.info.expires | moment('ll LT') }}</p>
        </div>

        <div class="text-muted text-small mt-2 mb-0 columns">
          <p class="mb-0 area" v-for="area in displayAreas" :key="area.description">
            {{ area }}
          </p>
        </div>
      </b-card-text>
    </b-card>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  filters: {
    headline(headline: any): any {
      if (typeof(headline) === 'string') {
        // tslint:disable-next-line:max-line-length
        const regex = /^(.*)issued\s+(january|february|march|april|may|june|july|august|september|october|november|december).*$/gi;
        return headline.replace(regex, '$1');
      }
      return headline;
    },
  },
})
export default class Hit extends Vue {
  @Prop({ required: true })
  private hit?: any;

  private severityVariants: Map<string, string> = new Map<string, string>()
    .set('EXTREME', 'danger')
    .set('SEVERE', 'warning')
    .set('MODERATE', 'info')
    .set('MINOR', 'success');

  private certaintyVariants: Map<string, string> = new Map<string, string>()
    .set('OBSERVED', 'danger')
    .set('LIKELY', 'warning')
    .set('POSSIBLE', 'info')
    .set('UNLIKELY', 'success');

  private urgencyVariants: Map<string, string> = new Map<string, string>()
    .set('IMMEDIATE', 'danger')
    .set('EXPECTED', 'warning')
    .set('FUTURE', 'info')
    .set('PAST', 'success');

  private responseTypeVariants: Map<string, string> = new Map<string, string>()
    .set('SHELTER', 'danger')
    .set('EVACUATE', 'danger')
    .set('PREPARE', 'warning')
    .set('EXECUTE', 'warning')
    .set('AVOID', 'warning')
    .set('MONITOR', 'info')
    .set('ASSESS', 'info')
    .set('ALL_CLEAR', 'success')
    .set('NONE', 'success');


  private get displayAreas(): string[] {
    if (this.hit && this.hit.info && this.hit.info.areas) {
      let areas = this.hit.info.areas.map((area: any) => area.description).sort();

      // Handle nws
      if (this.hit.alert.system === 'nws') {
        areas = areas[0].split(';').sort();
      }

      // Only show 4
      if (areas.length > 4) {
        const rem: number = areas.length - 3;
        areas = areas.slice(0, 4);
        areas[3] = `+ ${rem} more`;
      }

      return areas;
    }

    return [];
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/_custom.scss";
//@import "~bootswatch/dist/flatly/variables";
@import "~bootswatch/dist/darkly/variables";

.columns {
  display: grid;
  grid-template-areas: "a a";
  grid-gap: 2px 10px;
  grid-auto-columns: 50%;
}

.columns p:nth-child(2n) {
  text-align: right;
}

.area {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hit:hover {
  background: lighten($body-bg, 10%);
}

a {
  color: inherit;

  &:hover {
    color: inherit;
  }
}
</style>
