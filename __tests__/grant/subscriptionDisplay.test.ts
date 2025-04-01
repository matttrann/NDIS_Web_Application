import { pricingData } from "@/config/subscriptions";

const expectedOptions = ["Starter", "Pro"];


describe('subscription options', () => {
    it('There must be at least two subscription options', () => {
  
      expect((pricingData.length >= 2)).toBe(true);
    });
});

describe('Required Subscriptions avaliable', () => {
    it('Not all subscription options found', () => {
      const subscriptionOptions = pricingData.map(subscription => subscription.title);
      var expectedPlans = expectedOptions;
      const numberOfPlans = expectedOptions.length

      expectedPlans.forEach((expectedPlan, expectedIndex) => {
        subscriptionOptions.forEach((plan, index) => {
          if (expectedPlan === plan) {
            expectedPlans.splice(expectedIndex, 1);
          }
        });
      });
    
      expect((expectedPlans.length === 1) && (numberOfPlans >= 2)).toBe(true);
    });
});


describe('Required Subscriptions avaliable', () => {
  it('A free version must be avaliable', () => {
    var freePlan = false;

    pricingData.forEach((plan, index) => {
      if((plan.prices.monthly === 0) && (plan.prices.yearly === 0)){
        freePlan = true;
      }
    });
  
    expect(freePlan).toBe(true);
  });
});

describe('Required Subscriptions avaliable', () => {
  it('A paid version must be avaliable', () => {
    var paidPlan = false;

    pricingData.forEach((plan, index) => {
      if((plan.prices.monthly != 0) && (plan.prices.yearly != 0)){
        paidPlan = true;
      }
    });
  
    expect(paidPlan).toBe(true);
  });
});

