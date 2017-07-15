import Vue from 'vue'
import AppSection from '~/components/AppSection'

/**
 * An example unit test
 */
describe('AppSection.vue', () => {

  it('must have a section class', () => {
    const Constructor = Vue.extend(AppSection)
    let vm = new Constructor().$mount()
    expect(vm.$el.className).toBe('section')
  })

})
