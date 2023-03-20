<template>
  <tr>
    <td></td>
    <td class="align-middle" v-if="!isModifyState">{{ this.trim.name }}</td>
    <td class="align-middle" v-else>
      <input v-model="name_display" />
    </td>
    <td class="align-middle" v-if="!isModifyState">{{ this.msrp_display }}</td>
    <td class="align-middle" v-else>
      <label>
        <currency-input
          v-model.number="msrp_input"
          v-bind="{
            currency: 'USD',
            precision: 0,
            distractionFree: true,
            valueAsInteger: true
          }"
          class="trim-bucket-discount-value form-control form-control-sm"
          placeholder="msrp"
          :disabled="disabled"
        />
      </label>
    </td>
    <td class="align-middle" v-if="!isModifyState">
      {{ this.invoice_display }}
    </td>
    <td class="align-middle" v-else>
      <label>
        <currency-input
          v-model.number="invoice_input"
          v-bind="{
            currency: 'USD',
            precision: 0,
            distractionFree: true,
            valueAsInteger: true
          }"
          class="trim-bucket-discount-value form-control form-control-sm"
          placeholder="msrp"
          :disabled="disabled"
        />
      </label>
    </td>
    <!--    <td>-->
    <!--      <label>-->
    <!--        <currency-input-->
    <!--            v-bind="{ currency: 'USD', precision: 0, distractionFree: true, valueAsInteger: true }"-->
    <!--            v-model.number="listing_discount"-->
    <!--            class="trim-listing-discount-value form-control form-control-sm"-->
    <!--            placeholder="Needs Price"-->
    <!--            :disabled="disabled"/>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td>-->
    <!--      <label>-->
    <!--        <select v-model="listing_discount_type"-->
    <!--                class="trim-listing-discount-type form-control form-control-sm p-0" :disabled="disabled">-->
    <!--          <option v-for="val in discountValuesConst" :value="val" :key="'listing'+val">{{ val }}</option>-->
    <!--        </select>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td class="trim-listing-discount-min-price align-middle"> {{ min_listing_price }}</td>-->
    <td>
      <label>
        <currency-input
          v-model.number="bucket_discount"
          v-bind="{
            currency: 'USD',
            precision: 0,
            distractionFree: true,
            valueAsInteger: true
          }"
          class="trim-bucket-discount-value form-control form-control-sm"
          placeholder="Needs Price"
          :disabled="disabled"
        />
      </label>
    </td>
    <td>
      <label>
        <select
          v-model="bucket_discount_type"
          class="trim-bucket-discount-type form-control form-control-sm p-0"
          :disabled="disabled"
        >
          <option
            v-for="val in discountValuesConst"
            :key="'bucket' + val"
            :value="val"
          >
            {{ val }}
          </option>
        </select>
      </label>
    </td>
    <td class="trim-bucket-discount-min-price align-middle">
      {{ min_bucket_price }}
    </td>
    <td v-if="!isModifyState">
      <action-button
        :disabled="false"
        :submitting="false"
        class="btn-primary submit-button px-5"
        @click="modify"
      >
        Modifiy
      </action-button>
    </td>
    <td v-else>
      <action-button
        :disabled="false"
        :submitting="false"
        class="btn-primary submit-button px-5"
        @click="update"
      >
        Update
      </action-button>
    </td>
  </tr>
</template>
<script>
  import { exists } from '@/utilities'
  import _currency from 'currency.js'
  import ActionButton from '@/components/ActionButton'
  import { actor } from '@/store/modules/dealer/constants'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('dealer')

  export default {
    name: 'BidConfigTableTrim',
    components: { ActionButton },
    props: {
      Option: Object,
      trimIndex: Number,
      trim: Object,
      configuration: Object,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isModifyState: false
      }
    },
    inject: ['buildConfigObject', 'computeMinPrice', 'discountValuesConst'],
    computed: {
      name_display: {
        get: function () {
          return this.trim.name
        },
        set: function (newValue) {
          this.setValue('name', null, newValue)
        }
      },
      msrp_display() {
        return _currency(this.trim.msrp, { precision: 0 }).format(true)
      },
      msrp_input: {
        get: function () {
          return parseFloat(this.trim.msrp == null ? 0 : this.trim.msrp)
        },
        set: function (newValue) {
          this.setValue('msrp', null, newValue)
        }
      },
      invoice_display() {
        return _currency(this.trim.invoice, { precision: 0 }).format(true)
      },
      invoice_input: {
        get: function () {
          return parseFloat(this.trim.invoice == null ? 0 : this.trim.invoice)
        },
        set: function (newValue) {
          this.setValue('invoice', null, newValue)
        }
      },
      listing_discount_type: {
        get: function () {
          return this.getDiscountType('listing_discount')
        },
        set: function (discountType) {
          this.setValue('listing_discount', discountType, this.listing_discount)
        }
      },
      listing_discount: {
        get: function () {
          return this.getDiscount('listing_discount')
        },
        set: function (newValue) {
          this.setValue('listing_discount', null, newValue)
        }
      },
      bucket_discount_type: {
        get: function () {
          return this.getDiscountType('bucket_discount')
        },
        set: function (discountType) {
          this.setValue('bucket_discount', discountType, this.bucket_discount)
        }
      },
      bucket_discount: {
        get: function () {
          return this.getDiscount('bucket_discount')
        },
        set: function (newValue) {
          this.setValue('bucket_discount', null, newValue)
        }
      },
      min_listing_price() {
        return this.computeMinPrice(
          'listing_discount',
          this.trim.invoice,
          this.trim.msrp
        )
      },
      min_bucket_price() {
        return this.computeMinPrice(
          'bucket_discount',
          this.trim.invoice,
          this.trim.msrp
        )
      }
    },
    created() {}, // ['trim', 'configuration'],
    methods: {
      ...mapActions([actor.UPDATE_BID_OPTION_TRIM]),
      getDiscountType(name) {
        const hasValue =
          this.configuration &&
          this.configuration[name] &&
          this.configuration[name].type
        if (!hasValue) return '% Off MSRP'
        return (
          this.configuration[name].type + ' Off ' + this.configuration[name].ref
        )
      },
      getDiscount(name) {
        if (!exists(this.configuration)) return null
        return this.configuration[name].value
      },
      setValue(name, type, value) {
        this.trim[name] = value
      },
      modify() {
        this.isModifyState = true
      },
      async update() {
        this.isModifyState = false
        await this[actor.UPDATE_BID_OPTION_TRIM](this.option, this.trim)
      }
    }
  }
</script>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
</style>
