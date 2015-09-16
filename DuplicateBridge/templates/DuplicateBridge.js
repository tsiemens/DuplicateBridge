var SPADES_HTML = '<span style="color:black">♠</span>'
var HEARTS_HTML = '<span style="color:red">♥</span>'
var DIAMONDS_HTML = '<span style="color:red">♦</span>'
var CLUBS_HTML = '<span style="color:black">♣</span>'

var NO_TRUMPS = 'noTrumps';
var SPADES = 'spades';
var HEARTS = 'hearts';
var DIAMONDS = 'diamonds';
var CLUBS = 'clubs';

var N_S = 'northSouth';
var E_W = 'eastWest';

{% include "TeamsPage.js" %}
{% include "PlayPage.js" %}

function _newTeam( name1, name2 ) {
   return {
      p1: name1,
      p2: name2,
      string: function() {
         return this.p1 + " & " + this.p2;
      },
      valid: function() {
         return this.p1.length > 0 && this.p2.length > 0;
      }
   }
};

function _newGroup( _teamId2, _teamId2 ) {
   return { teamId1: _teamId1, teamId2: _teamId2 };
}

function _newMatch() {
   return { suit: null,
            level: 0,
            doubleFactor: 1,
            vulnerable: false,
            inContract: null,
            made: 0 };
}

function _newBoard( numMatches ) {
   var board = { matches: [] };
   for( var i = 0; i < numMatches; i++ ) {
      board.matches.push( _newMatch() );
   }
   return board;
}

function _newRound( numGroups ) {
   var round = {
      groups: [],
      boards: []
   }
   for( var i = 0; i < numGroups; i++ ) {
      round.groups.push( { N_S: null, E_W: null } );
      round.boards.push( _newBoard( numGroups ) );
   }
   return round;
}

function isMajor( suit ) {
   return suit === SPADES || suit === HEARTS;
}

function isMinor( suit ) {
   return suit === DIAMONDS || suit === CLUBS;
}

// CALCULATOR
function matchScore( match ) {
   var tricksOverAvg = Math.max( match.made - 6, 0 );
   var bidTricks = Math.min( tricksOverAvg, match.level );
   var overTricks = Math.max( tricksOverAvg - match.level, 0 );
   var underTricks = Math.max( 6 + match.level - match.made, 0 );

   console.assert( match.suit  && match.level > 0 && match.doubleFactor );

   var contractPoints = 0;
   if( match.suit === NO_TRUMPS ) {
      contractPoints = bidTricks * 30;
      if( bidTricks > 0 ) {
         contractPoints += 10;
      }
   } else if( isMajor( match.suit ) ) {
      contractPoints = bidTricks * 30;
   } else {
      contractPoints = bidTricks * 20;
   }
   contractPoints *= match.doubleFactor;

   var overTrickPoints = 0;
   if( match.doubleFactor === 1 ) {
      if( isMinor( match.suit ) ) {
         overTrickPoints = overTricks * 20;
      } else {
         overTrickPoints = overTricks * 30;
      }
   } else {
      var doubleFac = match.doubleFactor / 2;
      var vulnFac = match.vulnerable ? 2 : 1;
      overTrickPoints = overTricks * 100 * doubleFac * vulnFac;
   }

   var slamBonus = 0;
   if( bidTricks == 6 && tricksOverAvg >= 6 ) {
      slamBonus = match.vulnerable ? 500 : 750;
   } else if( bidTricks == 7 && tricksOverAgv == 7 ) {
      slamBonus = match.vulnerable ? 1000 : 1500;
   }

   var insultBonus = 0;
   if( match.doubleFactor > 1 && tricksOverAvg >= bidTricks ) {
      insultBonus = match.doubleFactor == 2 ? 50 : 100;
   }

   var penalty = 0;
   var firstUt = underTricks > 0 ? 1 : 0;
   var secondThirdUt = Math.max( Math.min( underTricks - 1, 2 ), 0 );
   var fourthPlusUt = Math.max( underTricks - 3, 0 );
   if( match.vulnerable ) {
      if( match.doubleFactor >= 2 ) {
         penalty += firstUt * 200;
         penalty += secondThirdUt * 300;
         penalty += fouthPlusUt * 300;
         if( match.doubleFactor == 4 ) {
            penalty *= 2;
         }
      } else {
         penalty += underTricks * 100;
      }
   } else {
      if( match.doubleFactor >= 2 ) {
         penalty += firstUt * 100;
         penalty += secondThirdUt * 200;
         penalty += fouthPlusUt * 300;
         if( match.doubleFactor == 4 ) {
            penalty *= 2;
         }
      } else {
         penalty += underTricks * 50;
      }
   }

   var gamePoints = 0;
   if( contractPoints >= 100 ) {
      gamePoints = match.vulnerable ? 500 : 300;
   } else if ( underTricks == 0 ) {
      gamePoints = 50;
   }

   if( underTricks == 0 ) {
      return contractPoints + overTrickPoints + slamBonus + insultBonus + gamePoints;
   } else {
      return - penalty;
   }
}
// CALCULATOR END

var appSm = {
   config: {
      page: null,
      teams: new Map(),
      rounds: []
   },
   nextTeamId: 0,

   pageIs : function( page ) {
      if( page === this.config.page ) {
         return;
      }
      var curpage = appDom.pages[ this.config.page ];
      var nextpage = appDom.pages[ page ];
      this.config.page = page;
      if( curpage ) {
         curpage.hide();
      }
      nextpage.show();
      console.log( 'Page: ' + page );

      appDom.activateBreadcrumb( page );

      if( page === 'play' ) {
         var roundNum = this.config.rounds.length;
         for( var i = 0; i < roundNum; i++ ) {
            playPage.popRoundTab();
            this.config.rounds.pop();
         }
         this.roundIs();
      }

   },

   teamIs : function( id, name1, name2 ) {
      this.config.teams.set( id, _newTeam( name1, name2 ) );
   },
   teamAdd : function( name1, name2 ) {
      this.config.teams.set( this.nextTeamId, _newTeam( name1, name2 ) );
      teamsPage.addTeamRow( this.nextTeamId );
      this.nextTeamId++;
   },
   teamDel : function( id ) {
      this.config.teams.delete( id );
      teamsPage.removeTeamRow( id );
   },

   roundIs : function() {
      var round = _newRound( appSm.config.teams.size / 2 );
      this.config.rounds.push( round );
      playPage.addRoundTab();
   },

   onGroupTeamSelected : function( e ) {
      updateDropdown( e );
      e = $( e );
   },

   onBreadcrumbClicked : function( e ) {
     e = $( e );
     appDom.popBreadcrumbsTo( e.data( 'page' ) );
     this.pageIs( e.data( 'page' ) );
   }
}

var appDom = {
    pages : {
        teams : $( "#teams-page" ),
        play : $( "#play-page" )
    },
    pageNames : {
        teams : 'Teams',
        play : 'Play'
    },

    breadcrumb : $( ".breadcrumb" ),

    pushBreadcrumb : function( page ) {
        var name = this.pageNames[ page ];
        this.breadcrumb.append(
                $( $.parseHTML( '<li data-page="' + page + '"  \
                                onclick="appSm.onBreadcrumbClicked(this)" >'
                                + name + '</li>' ) ) );
        this.activateBreadcrumb( page );
    },

    activateBreadcrumb : function( page ) {
        var breadcrumbs = this.breadcrumb.children();
        for( var i = 0; i < breadcrumbs.length; i++ ) {
            var child = $( breadcrumbs[ i ] )
            var childPage = child.data( 'page' )
            if( childPage === page ) {
                child.addClass( 'active' );
                child.text( this.pageNames[ childPage ] );
            } else {
                child.removeClass( 'active' );
                child.html( '<a href="#">' + this.pageNames[ childPage ] + '</a>' );
            }
        }
    },

    popBreadcrumbsTo : function( page ) {
        var breadcrumbs = this.breadcrumb.children();
        for( var i = breadcrumbs.length - 1; i > 0; i-- ) {
            var child = $( breadcrumbs[ i ] )
            if( child.data( 'page' ) == page ) {
                break;
            } else {
                child.remove();
            }
        }
        this.activateBreadcrumb( page );
    },
}

function main() {
   $( '#nav-home' ).html( SPADES_HTML + HEARTS_HTML + " Bridge " + DIAMONDS_HTML + CLUBS_HTML );
   appSm.pageIs( 'teams' );
   appSm.teamAdd( "", "" );
   appSm.teamAdd( "", "" );

   // TODO DEBUG SETUP
   $('.team-member-name').val('BOBBBYYYYY');
   $('#play-button').click();
}

main();
