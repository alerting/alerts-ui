<template>
  <div class="w-100">
    <div v-if="!loaded">
      <p class="h1 pt-4 text-center"><i class="fas fa-sync-alt fa-spin large" /><br /><span class="h5">Loading alert...</span></p>
    </div>
    <div v-else>
      <header class="header pb-3">
        <h1 class="text-uppercase">{{ headline }}</h1>
        <p class="h5 mt-1 issuer" v-if="info.senderName && info.web">Issued by <a class="name" :href="info.web" target="_blank">{{ info.senderName }}</a></p>
        <p class="h5 mt-1 issuer" v-if="info.senderName && !info.web">Issued by <span class="name">{{ info.senderName }}</span></p>
      </header>

      <div class="bg-dark p-2">
        <div class="d-flex justify-content-between m-2">
          <p class="m-0" v-if="info.urgency">
            <strong>Urgency</strong>
            <br>
            <b-badge
              :variant="urgencyVariants.get(info.urgency)"
              class="mr-1"
              v-if="info.urgency"
            >{{ info.urgency }}</b-badge>
          </p>
          <p v-if="info.severity" class="m-0 text-center">
            <strong>Severity</strong>
            <br>
            <b-badge
              :variant="severityVariants.get(info.severity)"
              class="mr-1"
              v-if="info.severity"
            >{{ info.severity }}</b-badge>
          </p>
          <p v-if="info.certainty" class="m-0 text-right">
            <strong>Certainty</strong>
            <br>
            <b-badge
              :variant="certaintyVariants.get(info.certainty)"
              class="mr-1"
              v-if="info.certainty"
            >{{ info.certainty }}</b-badge>
          </p>
        </div>
        <hr v-if="info.responseTypes" />
        <div v-if="info.responseTypes">
          <p class="pl-2 pr-2">
            <strong>Response</strong>
            <br>
            <b-badge
              :variant="responseTypeVariants.get(t)"
              v-for="t in info.responseTypes"
              :key="t"
            >{{ t.replace('_', ' ') }}</b-badge>
          </p>
        </div>
        <hr />
        <div class="d-flex justify-content-between m-2">
          <p class="mb-0" v-if="info.effective">
            <strong>Effective</strong>
            <br>
            {{ info.effective | moment('ll LT') }}
          </p>
          <p class="mb-0 text-center" v-if="info.onset">
            <strong>Onset</strong>
            <br>
            {{ info.onset | moment('ll LT') }}
          </p>
          <p class="mb-0 text-right" v-if="info.expires">
            <strong>Expires</strong>
            <br>
            {{ info.expires | moment('ll LT') }}
          </p>
        </div>
        <hr />
        <div class="text-muted text-small mt-2 mb-0 pl-1 pr-1 columns">
          <p class="m-0 p-0 area" v-for="area in displayAreas" :key="area.description" :title="area">
            {{ area }}
          </p>
        </div>
      </div>

      <p v-if="description" class="pt-3 pb-3" v-html="description" />

      <b-alert show variant="light" v-if="instruction">
        <p class="mb-0" v-html="instruction" />
      </b-alert>

      <div v-if="info.resources">
        <h2 class="h4">Resources</h2>
        <ul class="list-none">
          <li v-for="(resource, indx) in info.resources" :key="resource.uri">
            <a :href="`https://alerts.zacharyseguin.ca/resources/${resource.uri}`" target="_blank">Resource #{{ indx + 1}}</a>
            ({{ resource.mimeType }}, {{ resource.size | filesize }})
          </li>
        </ul>
      </div>

      <b-alert show variant="warning" v-if="isBroadcastImmediate">
        <p class="font-weight-bold">Broadcast alert</p>
        <p v-html="broadcastText" />
      </b-alert>

      <b-alert show variant="warning" v-if="isWireless">
        <p class="font-weight-bold">Wireless alert</p>
        <p v-html="wirelessText" />
      </b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import URI from 'urijs';
import filesize from 'filesize';

@Component({
  filters: {
    filesize(text: any): any {
      try {
        const size = parseInt(text, 10);
        return filesize(size);
      } catch {
        return "size unknown";
      }
    },
  },
  watch: {
    '$route': 'routeChanged',
  },
})
export default class Alert extends Vue {
  private id: string = "";
  private alert: any = null;
  private info: any = null;

  private loaded: boolean = false;

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

  public fetch(): void {
    const id: string[] = this.id.split(':');

    if (id.length !== 2) {
      return;
    }

    this.loaded = false;

    const url = new URI('https://alerts.zacharyseguin.ca/api/alerts/');
    url.filename(id[0]);

    fetch(url.toString())
      .then((r) => r.json())
      .then((r) => {
        this.info = r.infos[parseInt(id[1], 10)];
        delete r.infos;
        this.alert = r;

        this.loaded = true;
      });
  }

  private routeChanged(n: any, old: any): void {
    if (n.params.id && n.params.id !== this.id) {
      this.id = n.params.id;
      this.fetch();
    }
  }

  public mounted(): void {
    this.id = this.$route.params.id;
    this.fetch();
  }

  private get headline(): string {
    if (this.alert && this.info && this.info.headline) {
      let headline = this.info.headline.trim();

      // NWS
      if (this.alert.system === 'nws') {
        // tslint:disable-next-line:max-line-length
        const regex = /^(.*)issued\s+(january|february|march|april|may|june|july|august|september|october|november|december).*$/gi;
        headline = headline.replace(regex, '$1');
      }

      return headline.replace(/\n/g, '<br />');
    }

    return '';
  }

  private get description(): string {
    if (this.alert && this.info && this.info.description) {
      let description = this.info.description;

      // Environment Canada styling
      if (this.alert.system === 'naads') {
        description = description.replace(/\n+###\n+/g, '<hr />');
      }

      // NWS
      if (this.alert.system === 'nws') {
        description = description.replace(/\n\n/g, '<br /><br />');
        description = description.replace(/\n(?!\*)/g, ' ');
      }

      return description.trim().replace(/\n/g, '<br />');
    }

    return '';
  }

  private get instruction(): string {
    if (this.alert && this.info && this.info.instruction) {
      let instruction = this.info.instruction;

      // NWS
      if (this.alert.system === 'nws') {
        instruction = instruction.trim();
        instruction = instruction.replace(/\n\n/g, '<br /><br />');
        instruction = instruction.replace(/\n(?![\*])/g, ' ');
      }

      return instruction.trim().replace(/\n/g, '<br />');
    }

    return '';
  }

  private get displayAreas(): string[] {
    if (this.info && this.info.areas) {
      let areas = this.info.areas.map((area: any) => area.description).sort();

      // Handle nws
      if (this.alert.system === 'nws') {
        areas = areas[0].split(';').sort();
      }

      return areas;
    }

    return [];
  }

  private get isBroadcastImmediate(): boolean {
    const param = this.info.parameters['layer:SOREM:1.0:Broadcast_Immediately'];
    return Array.isArray(param) && param.length > 0 && param[0].toLowerCase() === 'yes';
  }

  private get broadcastText(): string {
    if ((this.info.parameters['layer:SOREM:1.0:Broadcast_Text'] || []).length > 0) {
      return this.info.parameters['layer:SOREM:1.0:Broadcast_Text'][0].trim().replace(/\n/g, '<br />');
    }

    return '';
  }

  private get isWireless(): boolean {
    const param = this.info.parameters['layer:SOREM:2.0:WirelessImmediate'];
    return Array.isArray(param) && param.length > 0 && param[0].toLowerCase() === 'yes';
  }

  private get wirelessText(): string {
    if ((this.info.parameters['layer:SOREM:2.0:WirelessText'] || []).length > 0) {
      return this.info.parameters['layer:SOREM:2.0:WirelessText'][0].trim().replace(/\n/g, '<br />');
    }

    return '';
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/_custom.scss";

.header {
  h1,
  p {
    margin: 0;
    padding: 0;
  }
}

.columns {
  display: grid;
  grid-template-areas: "a a";
  grid-gap: 2px 0;
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

.issuer a.name {
  text-decoration: underline;
  &:hover {
    color: #fff;
  }
}

.issuer .name {
  color: #eee;
  font-weight: bold;
}
</style>
