
var teamListItemTemplate = '\
<div class="row row-pad-md teamrow">\
  <div class="col-xs-5">\
    <input id="team-p1" type="text" class="form-control team-member-name" placeholder="Name" >\
  </div>\
  <div class="col-xs-5">\
    <input id="team-p2" type="text" class="form-control team-member-name" placeholder="Name" >\
  </div>\
  <div class="col-xs-1">\
    <button class="btn btn-danger" onclick="teamsPage.onRemoveTeamButtonClick(this)">X</button>\
  </div>\
</div>';

var teamsPage = {
   teamsList : $( '#teams' ),

   addTeamRow : function( id ) {
      var teamEntry = $( $.parseHTML( teamListItemTemplate ) );
      teamEntry.attr( "data-team-id", id );
      this.teamsList.append( teamEntry );
   },

   removeTeamRow : function( id ) {
      this.teamsList.find( ".teamrow[data-team-id='" + id + "']" ).remove();
   },

   onAddTeamButtonClick : function() {
      appSm.teamAdd( "", "" )
   },

   onRemoveTeamButtonClick : function( e ) {
      e = $( e );
      var row = e.parents( ".teamrow" );
      var id = row.data( 'team-id' );
      appSm.teamDel( id );
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
         appSm.teamIs( row.data( 'team-id' ),
               row.find( '#team-p1' ).val(),
               row.find( '#team-p2' ).val() );
      }
   },

   teamsValid: function() {
      if( appSm.config.teams.size % 2 != 0 ) {
         alert( "Need an even number of teams!" );
         return false;
      }
      var keys = appSm.config.teams.keys();
      var failed = false;
      appSm.config.teams.forEach( function( val ) {
         if( !failed && !val.valid() ) {
            alert( "All players need a name!" );
            failed = true;
          }
      } )
      return !failed;
   }
}
