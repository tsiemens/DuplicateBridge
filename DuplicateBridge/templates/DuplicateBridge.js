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
   return { suit: null, level: 0, inContract: null };
}

function _newBoard() {
   return { matches: [] };
}

function _newRound() {
   return {
      groups: [],
      boards: []
   }
}

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
         this.config.rounds.push( _newRound() );
         playPage.addRoundTab();
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
