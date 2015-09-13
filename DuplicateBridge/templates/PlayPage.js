
var roundTabStubTemplate = '<li role="round" class="round-tab-stub" onclick="playPage.onRoundTabClick(this)"><a href="#"></a></li>';

var roundTabTemplate = '\
<div class="round-tab">\
  <h4>Groups</h4>\
  <div class="round-groups">\
  </div>\
  <div class="round-boards">\
  </div>\
  <h4>Round Points</h4>\
  <div class="round-points">\
  </div>\
</div>';

var roundBoardTemplate = '\
<div class="round-board">\
</div>';

var groupRowTemplate = '\
<div class="row">\
  <div class="col-xs-1 col-md-1" style="padding-top:5px">N/S: </div>\
  <div class="group-team-selector team-ns col-xs-11 col-md-4"/>\
  <div class="col-xs-1 col-md-1" style="padding-top:5px">E/W: </div>\
  <div class="group-team-selector team-ew col-xs-11 col-md-4"/>\
</div><hr>';

var boardMatchTemplate = '\
<div class="row">\
  <div class="col-xs-12 match-teams"/>\
  <div class="col-xs-3">Contract:</div>\
  <div class="col-xs-4 contract-suit"/>\
  <div class="col-xs-4 contract-tricks"/>\
</div>\
<div class="row row-pad-md">\
  <div class="col-xs-2 col-sm-1">Played: </div>\
  <div class="col-xs-10 col-sm-11 contract-team"/>\
</div>\
<div class="row row-pad-md">\
  <div class="col-xs-2 col-sm-1">Made: </div>\
  <div class="col-xs-10 col-sm-11 tricks-made"/>\
<div>';

var boardTemplate = '\
<div class="board">\
  <h4 class="board-name"/>\
  <div class="board-matches"/>\
</div>';

var nextDropdownIdIdx = 0;
function _newDropdown( defaultText, items, onclick ) {
   nextDropdownIdIdx++;
   var template = '\
<div class="dropdown">\
  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" id="dropdownMenu' + nextDropdownIdIdx + '" aria-haspopup="true" aria-expanded="true">\
    ' + defaultText + ' <span class="caret"></span>\
  </button>\
  <ul class="dropdown-menu" aria-labelledby="dropdownMenu' + nextDropdownIdIdx + '">\
  </ul>\
</div>';

   var dropdown = $( $.parseHTML( template ) );
   var menu = dropdown.find( '.dropdown-menu' );
   for( var i = 0; i < items.length; i++ ) {
      menu.append( $( $.parseHTML(
            '<li id="' + items[ i ].id + '" onclick="' + onclick + '"><a href="#">' +
            items[ i ].html + '</a></li>' ) ) );
   }
   return dropdown;
}

function updateDropdown( e ){
   e = $( e );
   var dropdown = e.parents( '.dropdown' )
   dropdown.attr( 'data-val', e.attr( 'id' ) );
   dropdown.find( '.dropdown-toggle' ).html( e.html() + ' <span class="caret"></span>' )
}

function _newSuitDropdown() {
   return _newDropdown( 'Suit', [
         { id: NO_TRUMPS, html: 'NT' },
         { id: SPADES, html: SPADES_HTML },
         { id: HEARTS, html: HEARTS_HTML },
         { id: DIAMONDS, html: DIAMONDS_HTML },
         { id: CLUBS, html: CLUBS_HTML }
      ], 'updateDropdown(this)' );
}

function esc( str ) {
   return $("<div>").text(str).html();
}

function _newTeamDropdown() {
   teams = [];
   appSm.config.teams.forEach( function( val, key ) {
      teams.push( { id: key, html: esc( val.string() ) } )
   } );
   return _newDropdown( 'Team', teams, 'updateDropdown(this)' );
}

function _newContractTricksDropdown() {
   nums = [];
   for( var i = 1; i <= 7; i++ ) {
      nums.push( { id: i, html: i } );
   }
   return _newDropdown( 'Bid', nums, 'updateDropdown(this)' );
}

function _newMadeTricksDropdown() {
   nums = [];
   for( var i = 0; i <= 13; i++ ) {
      nums.push( { id: i, html: i } );
   }
   return _newDropdown( 'Made', nums, 'updateDropdown(this)' );
}

function _newGroupRow( groupId ) {
   var row = $( $.parseHTML( groupRowTemplate ) );
   row.attr( 'data-group-id', groupId );
   row.find( '.team-ns' ).append( _newTeamDropdown() );
   row.find( '.team-ew' ).append( _newTeamDropdown() );
   return row;
}

function _newBoardRow( boardId ) {
   var board = $( $.parseHTML( boardTemplate ) );
   board.find( '.board' ).attr( 'data-board-id', boardId );
   board.find( '.board-name' ).text( "Board " + ( Number( boardId ) + 1 ) );

   // for loop
   var matches = board.find( '.board-matches' );
   var match = $( $.parseHTML( boardMatchTemplate ) );
   match.find( '.match-teams' ).text( 'bob & bob vs joe & joe' );
   match.find( '.contract-suit' ).append( _newSuitDropdown() );
   match.find( '.contract-tricks' ).append( _newContractTricksDropdown() )
   match.find( '.contract-team' ).append( _newTeamDropdown() )
   match.find( '.tricks-made' ).append( _newMadeTricksDropdown() )
   matches.append( match );
   return board;
}

function _newRoundTab() {
   return {
      genDomElement: function( round ) {
         var tab = $( $.parseHTML( roundTabTemplate ) );
         tab.attr( 'data-round', round );
         for( var i = 0; i < appSm.config.teams.size / 2; i++ ) {
            tab.find( '.round-groups' ).append( _newGroupRow( i ) );
            tab.find( '.round-boards' ).append( _newBoardRow( 0 ) )
         }
         tab.append( _newSuitDropdown() );
         return tab;
      }
      // TODO
   };
}

var playPage = {
   tabStubs: $( '#round-tabs' ),
   tabContainer: $( '#round-tab-container' ),
   roundTabs: [],

   addRoundTab: function() {
      var roundNum = this.roundTabs.length + 1;
      var tab = _newRoundTab();
      this.roundTabs.push( tab );
      var stub = $( $.parseHTML( roundTabStubTemplate ) );
      stub.attr( 'data-round', roundNum );
      stub.find( 'a' ).text( 'Round ' + roundNum );
      this.tabStubs.append( stub );
      this.tabContainer.append( tab.genDomElement( roundNum ) );
      this.onRoundTabClick( stub );
   },

   popRoundTab: function() {
      var num = this.roundTabs.length;
      var tab = this.roundTabs.pop();
      this.tabContainer.find( '[data-round="' + num + '"]' ).remove()
      this.tabStubs.find( '[data-round="' + num + '"]' ).remove()

      if( num > 1 ) {
         this.tabStubs.find( '[data-round="' + num - 1 + '"]' ).click()
      }
   },

   onRoundTabClick: function( e ) {
      e = $( e );
      console.log( "Round: " + e.data( 'round' ) );
      $( '.round-tab-stub.active' ).removeClass( 'active' );
      e.addClass( 'active' );
      // TODO
   }
}

