
var teamListItemTemplate = '\
<div class="row row-pad-md teamrow">\
  <div class="col-xs-12 col-lg-1"><h5 class="teamrow-name"></h5></div>\
  <div class="col-xs-5">\
    <input id="team-p1" type="text" class="form-control" placeholder="Name" >\
  </div>\
  <div class="col-xs-5">\
    <input id="team-p2" type="text" class="form-control" placeholder="Name" >\
  </div>\
  <div class="col-xs-1">\
    <button class="btn btn-danger" onclick="teamsPage.onRemoveTeamButtonClick(this)">X</button>\
  </div>\
</div>';

var teamsPage = {
   teamsList : $( '#teams' ),
   nextTeamIdx : 0,

   teamIs : function() {
      bridgeConfig.teamIs( this.nextTeamIdx, "", "" );
      this.addTeamRow( this.nextTeamIdx );
      this.nextTeamIdx++;
   },

   teamDel : function( id ) {
      bridgeConfig.teamDel( id );
      this.removeTeamRow( id );
   },

   addTeamRow : function( id ) {
      var teamEntry = $( $.parseHTML( teamListItemTemplate ) );
      teamEntry.attr( "data-team-id", this.nextTeamIdx );
      teamEntry.find( ".teamrow-name" ).text( "Team " + this.nextTeamIdx );
      this.teamsList.append( teamEntry );
   },

   removeTeamRow : function( id ) {
      this.teamsList.find( ".teamrow[data-team-id='" + id + "']" ).remove();
   },

   onAddTeamButtonClick : function() {
      this.teamIs();
   },

   onRemoveTeamButtonClick : function( e ) {
      e = $( e );
      var row = e.parents( ".teamrow" );
      var id = row.data( 'team-id' );
      this.teamDel( id );
   },

   onPlayButtonClick : function() {
      this.updateTeamMemberNames()
      if( this.teamsValid() ) {
         appDom.pushBreadcrumb( 'play' );
         appSm.pageIs( 'play' );
      }
   },

   updateTeamMemberNames : function() {
      var teamrows = $( this.teamsList.children() );
      for( var i = 0; i < teamrows.length; i++ ) {
         var row = $( teamrows[ i ] );
         var team = bridgeConfig.teams.get( row.data( 'team-id' ) );
         team.p1 = row.find( '#team-p1' ).val()
         team.p2 = row.find( '#team-p2' ).val()
      }
   },

   teamsValid: function() {
      if( bridgeConfig.teams.size % 2 != 0 ) {
         alert( "Need an even number of teams!" );
         return false;
      }
      var keys = bridgeConfig.teams.keys();
      var failed = false;
      bridgeConfig.teams.forEach( function( val ) {
         if( !failed && !val.valid() ) {
            alert( "All players need a name!" );
            failed = true;
          }
      } )
      return !failed;
   }
}
