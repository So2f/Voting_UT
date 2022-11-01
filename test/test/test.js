                        /*      On recupere le contrat ainsi que les lib necesssaire (Big Number etc...)      */

const Voting = artifacts.require("Voting");
const{BN,expectRevert,expectEvent} = require('@openzeppelin/test-helpers');
const{expect} = require('chai');


                        /*      ici on setup les var comme les accounts lier au voter (sachant que l'owner sera le premier account donc account[0])      */
contract("Voting", accounts => {
  const owner = accounts[0];
  const voter2 = accounts[1];
  const voter3 = accounts[2];     //je ne sais pas si il etait necessaire de creer d'autres var voter mais j'imagine qu'il le faut 
  const voter4 = accounts[3];    
  const voter5 = accounts[4];

//  const propoposition1 = "This is Proposal 1";     //je voulais ici checker si deux propositions n'allaient pas etre identiques au cas ou mais pas eu le temps de finir
// const propoposition2 = "This is Proposal 2";

  let votingInstance;

  beforeEach(async() => {
    this.instance = await Voting.deployed();
  })


                    /*          Voter Registration        */
  
  describe("addVoter", () => {
    beforeEach(async () => {
      votingInstance = await Voting.new(owner);
      await votingInstance.addVoter(owner);
    })

    it("should revert if workflowStatus != RegisteringVoters",async ()=>{                                      //revert car ne peut pas add de voter si la session registering voter n'a pas commencer
      await votingInstance.startProposalsRegistering();
      await expectRevert(votingInstance.addVoter(voter2,owner),"Voters registration is not open yet");
    })
    it("should revert if voter already registered",async()=>{                                                //check si voter est deja register               
      await expectRevert(votingInstance.addVoter(voter2,owner),"Already registered");
    })
    it("should register a voter",async()=>{                                                     //check si le register du voter(data) est ok
      const data = await this.instance.getVoter.call(owner, {from:owner});
      expect(data.isRegistered).to.equal(true);
      expect(data.hasVoted).to.equal(false);
    })
  });

                        /*        Proposal Registration Start   */

  describe('startProposalRegistering', async function(){
    it('check revert if current status isn\'t registeringVoters', async function(){                 //check revertsi le status actuel n'est pas le "registeringVoters"
        await this.instance.startProposalsRegistering({from:owner});
        await expectRevert(this.instance.startProposalsRegistering({from:owner}), "Registering proposals cant start now");
    });
    it('check change workflowStatus into ProposalsRegistrationStarted', async function(){           //check si le workflow status ne change pas d'etat
        await this.instance.startProposalsRegistering({from:owner});
        const status = await this.instance.workflowStatus.call();
        expect(new BN(status)).to.be.bignumber.equal(new BN(1));
    });
    it('check emit WorkflowStatusChange event', async function(){                                 //check l'emit du changement d'etat du workflow
        const event = await this.instance.startProposalsRegistering({from:owner});
        expectEvent(event, "WorkflowStatusChange",{previousStatus:new BN(0), newStatus:new BN(1)});
    });
  });


                      /*      Add Proposal Part     */

//  describe('addProposal', async function(){
//    beforeEach(async function(){
//        await this.instance.addVoter(owner,{from:owner});
//        await this.instance.startProposalsRegistering({from:owner});
//    it('check emit a ProposalRegistered event', async function(){
//        const event = await this.instance.addProposal('random proposal', {from:owner});
//        expectEvent(event, "ProposalRegistered", {proposalId:new BN(0)});
//    });
//});

})

