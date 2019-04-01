<template>
  <div>{{ amountFormatted }}</div>
</template>

<script>
import formatCurrency from 'format-currency';

export default {
  name: 'Amount',
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    amountFormatted() {
      const f = formatCurrency(this.amount);
      if (this.amount >= 0) {
        return `$${f}`;
      }
      return `-$${f.substring(1)}`;
    },
  },
};
</script>
